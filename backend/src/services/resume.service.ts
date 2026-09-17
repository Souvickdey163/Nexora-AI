import { prisma } from '../config/database';
import { storageService } from './storage.service';
import { validatePdfFile } from '../utils/pdfValidator';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import { parseResumeText } from '../utils/resumeParser';
import { aiClient } from './ai.client';
import { ParsingStatus, AnalysisStatus } from '@prisma/client';
import { logger } from '../utils/logger';
import {
  AnalyzeResumeDto,
  ScoreProgressResponse,
  AnalyticsSummaryResponse,
} from '../types/resume.types';

export class ResumeService {
  /**
   * Helper: Sync extracted skills to UserProfile in PostgreSQL without duplicates
   */
  private async syncExtractedSkillsToProfile(userId: string, newSkills: string[]): Promise<void> {
    if (!newSkills || newSkills.length === 0) return;

    try {
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      if (userProfile) {
        const existingSkills = userProfile.skills || [];
        const combined = Array.from(new Set([...existingSkills, ...newSkills]));
        await prisma.userProfile.update({
          where: { userId },
          data: { skills: combined },
        });
        logger.info(`✨ Synced ${newSkills.length} extracted skills to UserProfile for user ${userId}`);
      }
    } catch (err: any) {
      logger.warn(`⚠️ Failed to sync skills to profile: ${err.message}`);
    }
  }

  /**
   * 1. Create a new Resume record and its initial Version 1
   */
  public async createResumeWithInitialVersion(
    userId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    title?: string
  ) {
    // 1. PDF Validation
    const validation = validatePdfFile(fileBuffer, originalName, mimeType);
    if (!validation.valid) {
      const err: any = new Error(validation.error);
      err.statusCode = 400;
      throw err;
    }

    // 2. Extract Text
    const extraction = await extractTextFromPdf(fileBuffer);
    const extractedText = extraction.text || '';
    const parsingStatus = extraction.success ? ParsingStatus.SUCCESS : ParsingStatus.FAILED;
    const parsingError = extraction.error || null;

    // 3. Parse Structured Info
    const extractedData = extraction.success ? parseResumeText(extractedText) : null;
    if (extractedData?.skills) {
      await this.syncExtractedSkillsToProfile(userId, extractedData.skills);
    }

    // 4. Prisma Transaction
    const resume = await prisma.$transaction(async (tx) => {
      const newResume = await tx.resume.create({
        data: {
          userId,
          title: title || originalName.replace(/\.pdf$/i, ''),
        },
      });

      const versionId = `${userId}_v1_${Date.now()}`;
      const storageKey = `uploads/resumes/${userId}/${versionId}.pdf`;

      const version = await tx.resumeVersion.create({
        data: {
          resumeId: newResume.id,
          versionNumber: 1,
          originalFileName: originalName,
          storageKey,
          mimeType,
          fileSize: fileBuffer.length,
          extractedText,
          extractedData: extractedData as any,
          parsingStatus,
          parsingError,
        },
      });

      // Update current version pointer
      await tx.resume.update({
        where: { id: newResume.id },
        data: { currentVersionId: version.id },
      });

      // 5. Store File
      await storageService.upload(fileBuffer, storageKey);

      return {
        ...newResume,
        currentVersion: version,
      };
    });

    return resume;
  }

  /**
   * 2. Upload a new ResumeVersion for an existing Resume (Version 2, 3...)
   */
  public async uploadResumeVersion(
    userId: string,
    resumeId: string,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    if (!resume) {
      const err: any = new Error('Resume not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    const validation = validatePdfFile(fileBuffer, originalName, mimeType);
    if (!validation.valid) {
      const err: any = new Error(validation.error);
      err.statusCode = 400;
      throw err;
    }

    const extraction = await extractTextFromPdf(fileBuffer);
    const extractedText = extraction.text || '';
    const parsingStatus = extraction.success ? ParsingStatus.SUCCESS : ParsingStatus.FAILED;
    const parsingError = extraction.error || null;
    const extractedData = extraction.success ? parseResumeText(extractedText) : null;

    if (extractedData?.skills) {
      await this.syncExtractedSkillsToProfile(userId, extractedData.skills);
    }

    const nextVersionNumber = (resume.versions[0]?.versionNumber || 0) + 1;
    const storageKey = `uploads/resumes/${userId}/${resumeId}_v${nextVersionNumber}_${Date.now()}.pdf`;

    const version = await prisma.$transaction(async (tx) => {
      const newVersion = await tx.resumeVersion.create({
        data: {
          resumeId: resume.id,
          versionNumber: nextVersionNumber,
          originalFileName: originalName,
          storageKey,
          mimeType,
          fileSize: fileBuffer.length,
          extractedText,
          extractedData: extractedData as any,
          parsingStatus,
          parsingError,
        },
      });

      await tx.resume.update({
        where: { id: resume.id },
        data: { currentVersionId: newVersion.id },
      });

      await storageService.upload(fileBuffer, storageKey);
      return newVersion;
    });

    return version;
  }

  /**
   * 3. List all Resumes for user
   */
  public async listUserResumes(userId: string) {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
          select: {
            id: true,
            versionNumber: true,
            originalFileName: true,
            fileSize: true,
            parsingStatus: true,
            createdAt: true,
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { id: true, overallScore: true, atsScore: true, analysisStatus: true },
            },
          },
        },
        _count: { select: { versions: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return resumes.map((r) => ({
      id: r.id,
      title: r.title,
      currentVersionId: r.currentVersionId,
      totalVersions: r._count.versions,
      latestVersion: r.versions[0] || null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  /**
   * 4. Get Resume Details & all versions
   */
  public async getResumeDetails(userId: string, resumeId: string) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          select: {
            id: true,
            versionNumber: true,
            originalFileName: true,
            fileSize: true,
            parsingStatus: true,
            createdAt: true,
            analyses: {
              orderBy: { createdAt: 'desc' },
              select: { id: true, overallScore: true, atsScore: true, targetRole: true, analysisStatus: true, createdAt: true },
            },
          },
        },
      },
    });

    if (!resume) {
      const err: any = new Error('Resume not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    return resume;
  }

  /**
   * 5. Get Resume Version Details
   */
  public async getVersionDetails(userId: string, resumeId: string, versionId: string) {
    const version = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resume: { id: resumeId, userId } },
      include: {
        resume: { select: { id: true, title: true, userId: true } },
        analyses: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!version) {
      const err: any = new Error('Resume version not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    return version;
  }

  /**
   * 6. Stream/Download Resume PDF File safely
   */
  public async getVersionFilePath(userId: string, resumeId: string, versionId: string): Promise<string> {
    const version = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resume: { id: resumeId, userId } },
    });

    if (!version) {
      const err: any = new Error('Resume version not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    return storageService.getFilePath(version.storageKey);
  }

  /**
   * 7. Trigger AI Analysis for a Resume Version (Idempotent, Preserves History)
   */
  public async analyzeVersion(
    userId: string,
    resumeId: string,
    versionId: string,
    dto: AnalyzeResumeDto
  ) {
    const version = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resume: { id: resumeId, userId } },
    });

    if (!version) {
      const err: any = new Error('Resume version not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    if (!version.extractedText || version.extractedText.length < 10) {
      const err: any = new Error('Cannot analyze a resume with no extracted text. Please re-upload a text-based PDF.');
      err.statusCode = 400;
      throw err;
    }

    // 1. Create ResumeAnalysis in PENDING status
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        resumeVersionId: version.id,
        targetRole: dto.targetRole || null,
        targetCompany: dto.targetCompany || null,
        jobDescription: dto.jobDescription || null,
        extractedData: version.extractedData as any,
        analysisStatus: AnalysisStatus.PENDING,
      },
    });

    // 2. Perform AI Analysis asynchronously/synchronously with safe fallback
    try {
      await prisma.resumeAnalysis.update({
        where: { id: analysis.id },
        data: { analysisStatus: AnalysisStatus.PROCESSING },
      });

      const aiResult = await aiClient.analyzeResume(
        version.extractedText,
        version.extractedData as any,
        dto.targetRole,
        dto.targetCompany,
        dto.jobDescription
      );

      const completed = await prisma.resumeAnalysis.update({
        where: { id: analysis.id },
        data: {
          overallScore: aiResult.overallScore,
          atsScore: aiResult.atsScore,
          contentScore: aiResult.contentScore,
          skillsScore: aiResult.skillsScore,
          experienceScore: aiResult.experienceScore,
          educationScore: aiResult.educationScore,
          projectsScore: aiResult.projectsScore,
          formattingScore: aiResult.formattingScore,
          keywordScore: aiResult.keywordScore,
          summaryScore: aiResult.summaryScore,

          strengths: aiResult.strengths,
          weaknesses: aiResult.weaknesses,
          missingKeywords: aiResult.missingKeywords,
          missingSkills: aiResult.missingSkills,
          recommendations: aiResult.recommendations,
          suggestedChanges: aiResult.suggestedChanges as any,

          aiProvider: aiResult.aiProvider,
          aiModel: aiResult.aiModel,
          analysisStatus: AnalysisStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return completed;
    } catch (err: any) {
      logger.error(`❌ AI Analysis Execution error: ${err.message}`);
      await prisma.resumeAnalysis.update({
        where: { id: analysis.id },
        data: {
          analysisStatus: AnalysisStatus.FAILED,
          errorMessage: err.message || 'AI Analysis Service error.',
        },
      });

      const failedError: any = new Error('AI Analysis processing failed. Please retry.');
      failedError.statusCode = 500;
      throw failedError;
    }
  }

  /**
   * 8. Get Paginated Analysis History for a Resume
   */
  public async getAnalysisHistory(userId: string, resumeId: string, page = 1, limit = 10) {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      const err: any = new Error('Resume not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    const skip = (page - 1) * limit;

    const [total, analyses] = await Promise.all([
      prisma.resumeAnalysis.count({
        where: { resumeVersion: { resumeId } },
      }),
      prisma.resumeAnalysis.findMany({
        where: { resumeVersion: { resumeId } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          resumeVersionId: true,
          targetRole: true,
          targetCompany: true,
          overallScore: true,
          atsScore: true,
          skillsScore: true,
          experienceScore: true,
          analysisStatus: true,
          createdAt: true,
          completedAt: true,
          resumeVersion: {
            select: { versionNumber: true, originalFileName: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: analyses,
    };
  }

  /**
   * 9. Get Single Detailed Analysis
   */
  public async getSingleAnalysis(userId: string, resumeId: string, analysisId: string) {
    const analysis = await prisma.resumeAnalysis.findFirst({
      where: { id: analysisId, resumeVersion: { resume: { id: resumeId, userId } } },
      include: {
        resumeVersion: {
          select: {
            id: true,
            versionNumber: true,
            originalFileName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!analysis) {
      const err: any = new Error('Analysis record not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    return analysis;
  }

  /**
   * 10. Get Score Progress History over time
   */
  public async getScoreProgress(userId: string, resumeId: string): Promise<ScoreProgressResponse> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      const err: any = new Error('Resume not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    const analyses = await prisma.resumeAnalysis.findMany({
      where: {
        resumeVersion: { resumeId },
        analysisStatus: AnalysisStatus.COMPLETED,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        overallScore: true,
        targetRole: true,
        createdAt: true,
      },
    });

    if (analyses.length === 0) {
      return {
        currentScore: 0,
        previousScore: 0,
        improvement: 0,
        history: [],
      };
    }

    const history = analyses.map((a) => ({
      analysisId: a.id,
      score: a.overallScore,
      targetRole: a.targetRole || undefined,
      createdAt: a.createdAt,
    }));

    const currentScore = history[history.length - 1].score;
    const previousScore = history.length > 1 ? history[history.length - 2].score : currentScore;
    const firstScore = history[0].score;
    const improvement = currentScore - firstScore;

    return {
      currentScore,
      previousScore,
      improvement,
      history,
    };
  }

  /**
   * 11. Dashboard Analytics Summary across user's resumes
   */
  public async getAnalyticsSummary(userId: string): Promise<AnalyticsSummaryResponse> {
    const totalResumes = await prisma.resume.count({ where: { userId } });
    
    const completedAnalyses = await prisma.resumeAnalysis.findMany({
      where: {
        resumeVersion: { resume: { userId } },
        analysisStatus: AnalysisStatus.COMPLETED,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        overallScore: true,
        atsScore: true,
        skillsScore: true,
        experienceScore: true,
        educationScore: true,
        projectsScore: true,
        missingSkills: true,
        createdAt: true,
      },
    });

    if (completedAnalyses.length === 0) {
      return {
        totalResumes,
        totalAnalyses: 0,
        latestScore: 0,
        averageScore: 0,
        scoreImprovement: 0,
        strongestCategory: 'N/A',
        weakestCategory: 'N/A',
        topMissingSkills: [],
      };
    }

    const totalAnalyses = completedAnalyses.length;
    const latestScore = completedAnalyses[0].overallScore;
    const totalScoreSum = completedAnalyses.reduce((acc, a) => acc + a.overallScore, 0);
    const averageScore = Math.round(totalScoreSum / totalAnalyses);

    const oldestScore = completedAnalyses[completedAnalyses.length - 1].overallScore;
    const scoreImprovement = latestScore - oldestScore;

    // Category calculation
    const avgCategory = {
      ATS: completedAnalyses.reduce((a, b) => a + b.atsScore, 0) / totalAnalyses,
      Skills: completedAnalyses.reduce((a, b) => a + b.skillsScore, 0) / totalAnalyses,
      Experience: completedAnalyses.reduce((a, b) => a + b.experienceScore, 0) / totalAnalyses,
      Education: completedAnalyses.reduce((a, b) => a + b.educationScore, 0) / totalAnalyses,
      Projects: completedAnalyses.reduce((a, b) => a + b.projectsScore, 0) / totalAnalyses,
    };

    const sortedCategories = Object.entries(avgCategory).sort((a, b) => b[1] - a[1]);
    const strongestCategory = sortedCategories[0][0];
    const weakestCategory = sortedCategories[sortedCategories.length - 1][0];

    // Missing skills aggregation
    const missingSkillCounts: Record<string, number> = {};
    completedAnalyses.forEach((a) => {
      a.missingSkills.forEach((skill) => {
        missingSkillCounts[skill] = (missingSkillCounts[skill] || 0) + 1;
      });
    });

    const topMissingSkills = Object.entries(missingSkillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill);

    return {
      totalResumes,
      totalAnalyses,
      latestScore,
      averageScore,
      scoreImprovement,
      strongestCategory,
      weakestCategory,
      topMissingSkills,
    };
  }

  /**
   * 12. Delete Resume & files safely
   */
  public async deleteResume(userId: string, resumeId: string): Promise<void> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: { versions: { select: { storageKey: true } } },
    });

    if (!resume) {
      const err: any = new Error('Resume not found or access denied.');
      err.statusCode = 404;
      throw err;
    }

    // Delete stored PDF files from disk
    for (const v of resume.versions) {
      await storageService.delete(v.storageKey);
    }

    // Delete database records via Prisma Cascade
    await prisma.resume.delete({
      where: { id: resumeId },
    });
    logger.info(`🗑️ Deleted resume ${resumeId} and associated resource records.`);
  }
}

export const resumeService = new ResumeService();
