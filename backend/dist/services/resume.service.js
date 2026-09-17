"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeService = exports.ResumeService = void 0;
const database_1 = require("../config/database");
const storage_service_1 = require("./storage.service");
const pdfValidator_1 = require("../utils/pdfValidator");
const pdfExtractor_1 = require("../utils/pdfExtractor");
const resumeParser_1 = require("../utils/resumeParser");
const ai_client_1 = require("./ai.client");
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
class ResumeService {
    async syncExtractedSkillsToProfile(userId, newSkills) {
        if (!newSkills || newSkills.length === 0)
            return;
        try {
            const userProfile = await database_1.prisma.userProfile.findUnique({
                where: { userId },
            });
            if (userProfile) {
                const existingSkills = userProfile.skills || [];
                const combined = Array.from(new Set([...existingSkills, ...newSkills]));
                await database_1.prisma.userProfile.update({
                    where: { userId },
                    data: { skills: combined },
                });
                logger_1.logger.info(`✨ Synced ${newSkills.length} extracted skills to UserProfile for user ${userId}`);
            }
        }
        catch (err) {
            logger_1.logger.warn(`⚠️ Failed to sync skills to profile: ${err.message}`);
        }
    }
    async createResumeWithInitialVersion(userId, fileBuffer, originalName, mimeType, title) {
        const validation = (0, pdfValidator_1.validatePdfFile)(fileBuffer, originalName, mimeType);
        if (!validation.valid) {
            const err = new Error(validation.error);
            err.statusCode = 400;
            throw err;
        }
        const extraction = await (0, pdfExtractor_1.extractTextFromPdf)(fileBuffer);
        const extractedText = extraction.text || '';
        const parsingStatus = extraction.success ? client_1.ParsingStatus.SUCCESS : client_1.ParsingStatus.FAILED;
        const parsingError = extraction.error || null;
        const extractedData = extraction.success ? (0, resumeParser_1.parseResumeText)(extractedText) : null;
        if (extractedData?.skills) {
            await this.syncExtractedSkillsToProfile(userId, extractedData.skills);
        }
        const resume = await database_1.prisma.$transaction(async (tx) => {
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
                    extractedData: extractedData,
                    parsingStatus,
                    parsingError,
                },
            });
            await tx.resume.update({
                where: { id: newResume.id },
                data: { currentVersionId: version.id },
            });
            await storage_service_1.storageService.upload(fileBuffer, storageKey);
            return {
                ...newResume,
                currentVersion: version,
            };
        });
        return resume;
    }
    async uploadResumeVersion(userId, resumeId, fileBuffer, originalName, mimeType) {
        const resume = await database_1.prisma.resume.findFirst({
            where: { id: resumeId, userId },
            include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
        });
        if (!resume) {
            const err = new Error('Resume not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        const validation = (0, pdfValidator_1.validatePdfFile)(fileBuffer, originalName, mimeType);
        if (!validation.valid) {
            const err = new Error(validation.error);
            err.statusCode = 400;
            throw err;
        }
        const extraction = await (0, pdfExtractor_1.extractTextFromPdf)(fileBuffer);
        const extractedText = extraction.text || '';
        const parsingStatus = extraction.success ? client_1.ParsingStatus.SUCCESS : client_1.ParsingStatus.FAILED;
        const parsingError = extraction.error || null;
        const extractedData = extraction.success ? (0, resumeParser_1.parseResumeText)(extractedText) : null;
        if (extractedData?.skills) {
            await this.syncExtractedSkillsToProfile(userId, extractedData.skills);
        }
        const nextVersionNumber = (resume.versions[0]?.versionNumber || 0) + 1;
        const storageKey = `uploads/resumes/${userId}/${resumeId}_v${nextVersionNumber}_${Date.now()}.pdf`;
        const version = await database_1.prisma.$transaction(async (tx) => {
            const newVersion = await tx.resumeVersion.create({
                data: {
                    resumeId: resume.id,
                    versionNumber: nextVersionNumber,
                    originalFileName: originalName,
                    storageKey,
                    mimeType,
                    fileSize: fileBuffer.length,
                    extractedText,
                    extractedData: extractedData,
                    parsingStatus,
                    parsingError,
                },
            });
            await tx.resume.update({
                where: { id: resume.id },
                data: { currentVersionId: newVersion.id },
            });
            await storage_service_1.storageService.upload(fileBuffer, storageKey);
            return newVersion;
        });
        return version;
    }
    async listUserResumes(userId) {
        const resumes = await database_1.prisma.resume.findMany({
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
    async getResumeDetails(userId, resumeId) {
        const resume = await database_1.prisma.resume.findFirst({
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
            const err = new Error('Resume not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        return resume;
    }
    async getVersionDetails(userId, resumeId, versionId) {
        const version = await database_1.prisma.resumeVersion.findFirst({
            where: { id: versionId, resume: { id: resumeId, userId } },
            include: {
                resume: { select: { id: true, title: true, userId: true } },
                analyses: { orderBy: { createdAt: 'desc' } },
            },
        });
        if (!version) {
            const err = new Error('Resume version not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        return version;
    }
    async getVersionFilePath(userId, resumeId, versionId) {
        const version = await database_1.prisma.resumeVersion.findFirst({
            where: { id: versionId, resume: { id: resumeId, userId } },
        });
        if (!version) {
            const err = new Error('Resume version not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        return storage_service_1.storageService.getFilePath(version.storageKey);
    }
    async analyzeVersion(userId, resumeId, versionId, dto) {
        const version = await database_1.prisma.resumeVersion.findFirst({
            where: { id: versionId, resume: { id: resumeId, userId } },
        });
        if (!version) {
            const err = new Error('Resume version not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        if (!version.extractedText || version.extractedText.length < 10) {
            const err = new Error('Cannot analyze a resume with no extracted text. Please re-upload a text-based PDF.');
            err.statusCode = 400;
            throw err;
        }
        const analysis = await database_1.prisma.resumeAnalysis.create({
            data: {
                resumeVersionId: version.id,
                targetRole: dto.targetRole || null,
                targetCompany: dto.targetCompany || null,
                jobDescription: dto.jobDescription || null,
                extractedData: version.extractedData,
                analysisStatus: client_1.AnalysisStatus.PENDING,
            },
        });
        try {
            await database_1.prisma.resumeAnalysis.update({
                where: { id: analysis.id },
                data: { analysisStatus: client_1.AnalysisStatus.PROCESSING },
            });
            const aiResult = await ai_client_1.aiClient.analyzeResume(version.extractedText, version.extractedData, dto.targetRole, dto.targetCompany, dto.jobDescription);
            const completed = await database_1.prisma.resumeAnalysis.update({
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
                    suggestedChanges: aiResult.suggestedChanges,
                    aiProvider: aiResult.aiProvider,
                    aiModel: aiResult.aiModel,
                    analysisStatus: client_1.AnalysisStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });
            return completed;
        }
        catch (err) {
            logger_1.logger.error(`❌ AI Analysis Execution error: ${err.message}`);
            await database_1.prisma.resumeAnalysis.update({
                where: { id: analysis.id },
                data: {
                    analysisStatus: client_1.AnalysisStatus.FAILED,
                    errorMessage: err.message || 'AI Analysis Service error.',
                },
            });
            const failedError = new Error('AI Analysis processing failed. Please retry.');
            failedError.statusCode = 500;
            throw failedError;
        }
    }
    async getAnalysisHistory(userId, resumeId, page = 1, limit = 10) {
        const resume = await database_1.prisma.resume.findFirst({
            where: { id: resumeId, userId },
        });
        if (!resume) {
            const err = new Error('Resume not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        const skip = (page - 1) * limit;
        const [total, analyses] = await Promise.all([
            database_1.prisma.resumeAnalysis.count({
                where: { resumeVersion: { resumeId } },
            }),
            database_1.prisma.resumeAnalysis.findMany({
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
    async getSingleAnalysis(userId, resumeId, analysisId) {
        const analysis = await database_1.prisma.resumeAnalysis.findFirst({
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
            const err = new Error('Analysis record not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        return analysis;
    }
    async getScoreProgress(userId, resumeId) {
        const resume = await database_1.prisma.resume.findFirst({
            where: { id: resumeId, userId },
        });
        if (!resume) {
            const err = new Error('Resume not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        const analyses = await database_1.prisma.resumeAnalysis.findMany({
            where: {
                resumeVersion: { resumeId },
                analysisStatus: client_1.AnalysisStatus.COMPLETED,
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
    async getAnalyticsSummary(userId) {
        const totalResumes = await database_1.prisma.resume.count({ where: { userId } });
        const completedAnalyses = await database_1.prisma.resumeAnalysis.findMany({
            where: {
                resumeVersion: { resume: { userId } },
                analysisStatus: client_1.AnalysisStatus.COMPLETED,
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
        const missingSkillCounts = {};
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
    async deleteResume(userId, resumeId) {
        const resume = await database_1.prisma.resume.findFirst({
            where: { id: resumeId, userId },
            include: { versions: { select: { storageKey: true } } },
        });
        if (!resume) {
            const err = new Error('Resume not found or access denied.');
            err.statusCode = 404;
            throw err;
        }
        for (const v of resume.versions) {
            await storage_service_1.storageService.delete(v.storageKey);
        }
        await database_1.prisma.resume.delete({
            where: { id: resumeId },
        });
        logger_1.logger.info(`🗑️ Deleted resume ${resumeId} and associated resource records.`);
    }
}
exports.ResumeService = ResumeService;
exports.resumeService = new ResumeService();
