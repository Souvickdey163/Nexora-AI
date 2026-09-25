import { prisma } from '../config/database';
import { PLACEMENT_WEIGHTS, getReadinessLevel, TARGET_ROLES, COMPANY_CATEGORIES, CompanyCategory } from '../config/placement.config';
import { CREDIT_COSTS } from '../config/creditCosts';
import { creditService } from './credit.service';
import { aiClient } from './ai.client';
import { logger } from '../utils/logger';

export interface DimensionEvaluation {
  dimension: 'INTERVIEW' | 'CODING' | 'RESUME' | 'ROADMAP';
  score: number | null;
  evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';
  source: string;
  explanation: string;
  evidenceDetails: string[];
  sourceUpdatedAt: Date | null;
}

export class PlacementReadinessService {
  /**
   * Main entry point to calculate, explain, and persist a Placement Readiness Assessment.
   */
  async calculateAssessment(
    userId: string,
    targetRole: string = 'Software Engineer',
    companyCategory: string = 'Product Technology',
    forceRefresh: boolean = false
  ) {
    logger.info(`🔍 Calculating Placement Readiness | UserId: ${userId} | TargetRole: ${targetRole} | Category: ${companyCategory}`);

    // Clean inputs
    const roleClean = (targetRole || 'Software Engineer').trim();
    const catClean = (companyCategory || 'Product Technology').trim();

    // 1. Check if a recent cached assessment exists (within last 15 mins) unless forceRefresh is true
    if (!forceRefresh) {
      const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
      const cached = await prisma.placementAssessment.findFirst({
        where: {
          userId,
          targetRole: roleClean,
          companyCategory: catClean,
          createdAt: { gte: fifteenMinsAgo },
        },
        include: {
          dimensions: true,
          recommendations: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (cached) {
        logger.info(`⚡ Returning cached Placement Assessment (${cached.id}) for user ${userId}`);
        return cached;
      }
    }

    // 2. Gather Evidence across 4 primary dimensions + GitHub
    const interviewDim = await this.evaluateInterviewDimension(userId);
    const codingDim = await this.evaluateCodingDimension(userId, roleClean);
    const resumeDim = await this.evaluateResumeDimension(userId, roleClean);
    const roadmapDim = await this.evaluateRoadmapDimension(userId, roleClean);

    const dimensions: DimensionEvaluation[] = [interviewDim, codingDim, resumeDim, roadmapDim];

    // Optional GitHub signal
    const githubEvidence = await this.evaluateGitHubSignal(userId);

    // 3. Compute Deterministic Weighted Readiness Score and Evidence Coverage
    let totalAvailableWeight = 0;
    let weightedScoreSum = 0;

    dimensions.forEach((dim) => {
      const weight = PLACEMENT_WEIGHTS[dim.dimension];
      if (dim.score !== null && dim.evidenceLevel !== 'INSUFFICIENT') {
        totalAvailableWeight += weight;
        weightedScoreSum += dim.score * weight;
      }
    });

    const evidenceCoverage = Math.round(totalAvailableWeight * 100);

    let overallScore = 0;
    if (totalAvailableWeight > 0) {
      // Normalize over available weights
      overallScore = Math.min(100, Math.max(0, Math.round(weightedScoreSum / totalAvailableWeight)));
    }

    const readinessLevelConfig = getReadinessLevel(overallScore);
    const readinessLevel = readinessLevelConfig.label;

    // 4. Deduct Credits for AI-enhanced generation (2 credits)
    await creditService.deductCredits(
      userId,
      CREDIT_COSTS.PLACEMENT_ASSESSMENT,
      'PLACEMENT_ASSESSMENT',
      `Placement Intelligence assessment for ${roleClean}`
    );

    // 5. Generate AI Explanation & Guidance (Numeric score is pre-calculated above)
    let aiResult;
    try {
      aiResult = await aiClient.explainPlacementReadiness({
        targetRole: roleClean,
        companyCategory: catClean,
        overallScore,
        evidenceCoverage,
        readinessLevel,
        dimensions,
        githubEvidence,
      });
    } catch (err: any) {
      logger.warn(`AI explanation generator warning: ${err.message}. Using dynamic fallback.`);
      aiResult = {
        summary: `Your Placement Readiness Index for ${roleClean} is ${overallScore}/100 (${readinessLevel}). Evidence coverage is ${evidenceCoverage}%.`,
        strengths: dimensions.filter((d) => d.evidenceLevel === 'STRONG').map((d) => `${d.dimension}: ${d.explanation}`),
        priorityAreas: dimensions.filter((d) => d.evidenceLevel === 'INSUFFICIENT' || d.evidenceLevel === 'LIMITED').map((d) => `${d.dimension}: ${d.explanation}`),
        recommendedActions: [
          {
            priority: 'HIGH' as const,
            title: 'Complete Mock Interview',
            description: 'Practice technical interviews to improve your readiness evidence.',
            actionType: 'MOCK_INTERVIEW',
            route: '/features/interview',
          },
        ],
        roleSpecificAdvice: [`Focus on core ${roleClean} skills and practice consistent coding.`],
      };
    }

    // 6. Persist Assessment, Dimensions, and Recommendations to PostgreSQL via Prisma transaction
    const savedAssessment = await prisma.$transaction(async (tx) => {
      const assessment = await tx.placementAssessment.create({
        data: {
          userId,
          targetRole: roleClean,
          companyCategory: catClean,
          overallScore,
          evidenceCoverage,
          readinessLevel,
          summary: aiResult.summary,
          strengths: aiResult.strengths,
          priorityAreas: aiResult.priorityAreas,
          roleSpecificAdvice: aiResult.roleSpecificAdvice,
          aiExplanation: aiResult as any,
          dimensions: {
            create: dimensions.map((d) => ({
              dimension: d.dimension,
              score: d.score,
              evidenceLevel: d.evidenceLevel,
              source: d.source,
              explanation: d.explanation,
              evidenceDetails: d.evidenceDetails,
              sourceUpdatedAt: d.sourceUpdatedAt,
            })),
          },
          recommendations: {
            create: (aiResult.recommendedActions || []).map((rec) => ({
              priority: rec.priority || 'MEDIUM',
              title: rec.title,
              description: rec.description,
              actionType: rec.actionType || 'PRACTICE_CODING',
              route: rec.route || '/features/placement',
              completed: false,
            })),
          },
        },
        include: {
          dimensions: true,
          recommendations: { orderBy: { createdAt: 'asc' } },
        },
      });

      // Record activity
      await tx.userActivity.create({
        data: {
          userId,
          actionType: 'ASSESSMENT_COMPLETED',
          title: `Calculated Placement Readiness for ${roleClean}`,
          metadata: {
            assessmentId: assessment.id,
            overallScore,
            readinessLevel,
            evidenceCoverage,
          },
        },
      });

      return assessment;
    });

    logger.info(`✅ Placement Assessment saved successfully. ID: ${savedAssessment.id} | Score: ${overallScore}/100`);
    return savedAssessment;
  }

  /**
   * Evaluate Interview Readiness Dimension
   */
  private async evaluateInterviewDimension(userId: string): Promise<DimensionEvaluation> {
    const interviews = await prisma.interview.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (interviews.length === 0) {
      return {
        dimension: 'INTERVIEW',
        score: null,
        evidenceLevel: 'INSUFFICIENT',
        source: 'AI Interview Studio',
        explanation: 'No completed mock or live interview attempts recorded in Nexora.',
        evidenceDetails: ['0 completed mock/live interviews'],
        sourceUpdatedAt: null,
      };
    }

    const scores = interviews.map((i) => i.overallScore ?? i.technicalScore ?? 60).filter((s) => s > 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 60;
    const latestScore = scores[0] || avgScore;

    // Weight recent performance slightly higher
    const weightedScore = Math.min(100, Math.round(latestScore * 0.6 + avgScore * 0.4));

    let trendStr = 'Single Attempt';
    if (scores.length >= 2) {
      const prevAvg = Math.round(scores.slice(1).reduce((a, b) => a + b, 0) / (scores.length - 1));
      if (latestScore > prevAvg + 3) trendStr = 'Improving';
      else if (latestScore < prevAvg - 3) trendStr = 'Declining';
      else trendStr = 'Stable';
    }

    let evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT' = 'LIMITED';
    if (interviews.length >= 4) evidenceLevel = 'STRONG';
    else if (interviews.length >= 2) evidenceLevel = 'MODERATE';

    const latest = interviews[0];
    const details = [
      `${interviews.length} completed interview session${interviews.length > 1 ? 's' : ''}`,
      `Latest session score: ${latestScore}/100`,
      `Performance trend: ${trendStr}`,
    ];

    if (latest.technicalScore) details.push(`Technical accuracy: ${latest.technicalScore}%`);
    if (latest.communicationScore) details.push(`Communication score: ${latest.communicationScore}%`);

    return {
      dimension: 'INTERVIEW',
      score: weightedScore,
      evidenceLevel,
      source: 'AI Interview Studio',
      explanation: `${interviews.length} interview attempt(s) analyzed with ${trendStr.toLowerCase()} trend. Latest score: ${latestScore}/100.`,
      evidenceDetails: details,
      sourceUpdatedAt: latest.completedAt || latest.createdAt,
    };
  }

  /**
   * Evaluate Coding Readiness Dimension
   */
  private async evaluateCodingDimension(userId: string, targetRole: string): Promise<DimensionEvaluation> {
    const solvedProgress = await prisma.codingProgress.findMany({
      where: { userId, isSolved: true },
      include: { problem: true },
    });

    const totalSubmissions = await prisma.codingSubmission.count({ where: { userId } });
    const acceptedSubmissions = await prisma.codingSubmission.count({
      where: { userId, status: 'ACCEPTED' },
    });

    if (solvedProgress.length === 0 && totalSubmissions === 0) {
      return {
        dimension: 'CODING',
        score: null,
        evidenceLevel: 'INSUFFICIENT',
        source: 'Coding Arena',
        explanation: 'No solved coding challenges or submissions recorded in Nexora.',
        evidenceDetails: ['0 solved problems', '0 coding submissions'],
        sourceUpdatedAt: null,
      };
    }

    const easyCount = solvedProgress.filter((p) => p.problem.difficulty === 'EASY').length;
    const mediumCount = solvedProgress.filter((p) => p.problem.difficulty === 'MEDIUM').length;
    const hardCount = solvedProgress.filter((p) => p.problem.difficulty === 'HARD').length;
    const solvedCount = solvedProgress.length;

    const topicsSet = new Set(solvedProgress.map((p) => p.problem.topic));
    const topicCount = topicsSet.size;

    const accuracyPct = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 70;

    // Explainable score formula taking into account difficulty distribution and accuracy
    // 100 Easy problems should NOT automatically produce 100 readiness!
    const difficultyPoints = easyCount * 2 + mediumCount * 5 + hardCount * 10;
    const breadthPoints = Math.min(25, topicCount * 4);
    const accuracyFactor = accuracyPct / 100;

    const baseScore = Math.min(95, Math.round((difficultyPoints * 0.6 + breadthPoints * 1.5) * (0.5 + accuracyFactor * 0.5)));
    const score = Math.min(100, Math.max(10, baseScore));

    let evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT' = 'LIMITED';
    if (solvedCount >= 20 || (mediumCount >= 8 && hardCount >= 2)) evidenceLevel = 'STRONG';
    else if (solvedCount >= 8 || mediumCount >= 3) evidenceLevel = 'MODERATE';

    const lastActivity = await prisma.codingSubmission.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const details = [
      `${solvedCount} problem${solvedCount !== 1 ? 's' : ''} solved (${easyCount} easy, ${mediumCount} medium, ${hardCount} hard)`,
      `Submission accuracy: ${accuracyPct}% across ${totalSubmissions} attempts`,
      `Topic breadth: ${topicCount} distinct DSA topics covered`,
    ];

    return {
      dimension: 'CODING',
      score,
      evidenceLevel,
      source: 'Coding Arena',
      explanation: `Solved ${solvedCount} problems (${mediumCount} medium, ${hardCount} hard) across ${topicCount} topics with ${accuracyPct}% accuracy.`,
      evidenceDetails: details,
      sourceUpdatedAt: lastActivity?.createdAt || null,
    };
  }

  /**
   * Evaluate Resume Readiness Dimension
   */
  private async evaluateResumeDimension(userId: string, targetRole: string): Promise<DimensionEvaluation> {
    const resume = await prisma.resume.findFirst({
      where: { userId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
          include: {
            analyses: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const latestVersion = resume?.versions[0];
    const latestAnalysis = latestVersion?.analyses[0];

    if (!resume || !latestVersion || !latestAnalysis) {
      return {
        dimension: 'RESUME',
        score: null,
        evidenceLevel: 'INSUFFICIENT',
        source: 'Resume Intelligence',
        explanation: 'No analyzed resume found. Upload and analyze your latest resume.',
        evidenceDetails: ['No ATS resume analysis records available'],
        sourceUpdatedAt: null,
      };
    }

    const score = latestAnalysis.atsScore || latestAnalysis.overallScore || 50;

    let evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT' = 'LIMITED';
    if (score >= 75) evidenceLevel = 'STRONG';
    else if (score >= 55) evidenceLevel = 'MODERATE';

    const details = [
      `Latest ATS Score: ${latestAnalysis.atsScore}/100`,
      `Content Quality Score: ${latestAnalysis.contentScore}/100`,
      `Skill Coverage Score: ${latestAnalysis.skillsScore}/100`,
      `Target Role Alignment: ${latestAnalysis.targetRole || targetRole}`,
    ];

    return {
      dimension: 'RESUME',
      score,
      evidenceLevel,
      source: 'Resume Intelligence',
      explanation: `Analyzed resume version "${latestVersion.originalFileName}" scored ${score}/100 for ${latestAnalysis.targetRole || targetRole}.`,
      evidenceDetails: details,
      sourceUpdatedAt: latestAnalysis.createdAt,
    };
  }

  /**
   * Evaluate Career Roadmap Readiness Dimension
   */
  private async evaluateRoadmapDimension(userId: string, targetRole: string): Promise<DimensionEvaluation> {
    const roadmap = await prisma.careerRoadmap.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { milestones: true },
    });

    if (!roadmap) {
      return {
        dimension: 'ROADMAP',
        score: null,
        evidenceLevel: 'INSUFFICIENT',
        source: 'Career Roadmap',
        explanation: 'No active career roadmap found. Generate your personalized career roadmap.',
        evidenceDetails: ['No active roadmap active for target role'],
        sourceUpdatedAt: null,
      };
    }

    const totalMilestones = roadmap.milestones.length;
    const completedMilestones = roadmap.milestones.filter((m) => m.completed).length;

    const progressPct = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : roadmap.progressPct || 0;

    const score = progressPct;

    let evidenceLevel: 'STRONG' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT' = 'LIMITED';
    if (progressPct >= 70) evidenceLevel = 'STRONG';
    else if (progressPct >= 30) evidenceLevel = 'MODERATE';

    const details = [
      `${completedMilestones} of ${totalMilestones} milestones completed (${progressPct}%)`,
      `Roadmap Schedule: ${roadmap.weeklySchedule}`,
      `Target Role: ${roadmap.targetRole}`,
    ];

    return {
      dimension: 'ROADMAP',
      score,
      evidenceLevel,
      source: 'Career Roadmap',
      explanation: `Completed ${completedMilestones} of ${totalMilestones} milestones (${progressPct}%) on active pathway for ${roadmap.targetRole}.`,
      evidenceDetails: details,
      sourceUpdatedAt: roadmap.updatedAt,
    };
  }

  /**
   * Optional GitHub Signal Evaluator
   */
  private async evaluateGitHubSignal(userId: string): Promise<string[]> {
    const evidences = await prisma.gitHubSkillEvidence.findMany({
      where: { userId },
      take: 5,
    });

    const analyses = await prisma.gitHubRepositoryAnalysis.findMany({
      where: { userId, status: 'COMPLETED' },
      take: 3,
    });

    const signals: string[] = [];

    if (analyses.length > 0) {
      signals.push(`${analyses.length} GitHub repositories analyzed with architecture and engineering signals.`);
    }

    if (evidences.length > 0) {
      evidences.forEach((ev) => {
        signals.push(`Verified ${ev.skill} skill evidence (${ev.evidenceLevel}).`);
      });
    }

    return signals;
  }

  /**
   * Fetch current latest assessment for user
   */
  async getCurrentAssessment(userId: string) {
    return prisma.placementAssessment.findFirst({
      where: { userId },
      include: {
        dimensions: true,
        recommendations: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Fetch assessment history for user
   */
  async getAssessmentHistory(userId: string, limit: number = 20) {
    return prisma.placementAssessment.findMany({
      where: { userId },
      include: {
        dimensions: true,
        recommendations: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Fetch specific assessment by ID ensuring user ownership
   */
  async getAssessmentById(userId: string, assessmentId: string) {
    const assessment = await prisma.placementAssessment.findFirst({
      where: { id: assessmentId, userId },
      include: {
        dimensions: true,
        recommendations: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!assessment) {
      const err: any = new Error('Placement assessment not found or access unauthorized.');
      err.statusCode = 404;
      throw err;
    }

    return assessment;
  }

  /**
   * Toggle recommendation completion status with ownership check
   */
  async toggleRecommendationCompleted(userId: string, assessmentId: string, recommendationId: string, completed?: boolean) {
    // Ensure ownership
    await this.getAssessmentById(userId, assessmentId);

    const rec = await prisma.placementRecommendation.findFirst({
      where: { id: recommendationId, assessmentId },
    });

    if (!rec) {
      const err: any = new Error('Recommendation not found.');
      err.statusCode = 404;
      throw err;
    }

    const newCompleted = completed !== undefined ? completed : !rec.completed;

    return prisma.placementRecommendation.update({
      where: { id: recommendationId },
      data: { completed: newCompleted },
    });
  }

  /**
   * Retrieve summary metrics for dashboard or header
   */
  async getSummary(userId: string) {
    const current = await this.getCurrentAssessment(userId);
    const historyCount = await prisma.placementAssessment.count({ where: { userId } });

    return {
      hasAssessment: !!current,
      currentScore: current?.overallScore ?? null,
      readinessLevel: current?.readinessLevel ?? 'Needs Attention',
      evidenceCoverage: current?.evidenceCoverage ?? 0,
      targetRole: current?.targetRole ?? 'Software Engineer',
      companyCategory: current?.companyCategory ?? 'Product Technology',
      lastCalculatedAt: current?.createdAt ?? null,
      totalAssessmentsCalculated: historyCount,
    };
  }
}

export const placementReadinessService = new PlacementReadinessService();
