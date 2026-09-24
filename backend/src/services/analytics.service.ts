import { prisma } from '../config/database';

export class AnalyticsService {
  async getDashboardAnalytics(userId: string) {
    // 1. Fetch User Data across all modules
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resumes: {
          include: {
            versions: {
              include: { analyses: { orderBy: { createdAt: 'desc' }, take: 5 } },
              orderBy: { versionNumber: 'desc' },
            },
          },
        },
        codingProgress: { include: { problem: true } },
        interviews: {
          where: { status: 'COMPLETED' },
          include: { report: true },
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
        assessments: { orderBy: { completedAt: 'desc' }, take: 10 },
        githubAnalyses: { orderBy: { createdAt: 'desc' }, take: 5 },
        githubSkillEvidences: true,
        mentorConversations: { include: { messages: true } },
        roadmaps: { where: { status: 'ACTIVE' }, include: { milestones: true }, take: 1 },
        creditTransactions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // 2. Resume Metrics
    const latestAnalysis = user.resumes[0]?.versions[0]?.analyses[0];
    const resumeScore = latestAnalysis?.overallScore ?? null;

    // 3. Coding Metrics
    const solvedProblems = user.codingProgress.filter((p) => p.isSolved);
    const attemptedCount = user.codingProgress.length;

    // 4. Interview Metrics
    const completedInterviews = user.interviews;
    const avgInterviewScore = completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) /
            completedInterviews.length
        )
      : null;

    // 5. Assessment Metrics
    const assessmentAttempts = user.assessments;
    const avgAssessmentAccuracy = assessmentAttempts.length > 0
      ? Math.round(
          assessmentAttempts.reduce((acc, a) => acc + a.accuracyPct, 0) /
            assessmentAttempts.length
        )
      : null;

    // 6. Roadmap Metrics
    const activeRoadmap = user.roadmaps[0];
    const roadmapProgressPct = activeRoadmap?.progressPct ?? 0;

    // 7. Activity Timeline Data
    const totalActivitiesCount =
      solvedProblems.length +
      completedInterviews.length +
      assessmentAttempts.length +
      user.githubAnalyses.length;

    const hasEnoughData = totalActivitiesCount > 0 || resumeScore !== null;

    return {
      hasEnoughData,
      summary: {
        resumeScore,
        codingSolvedCount: solvedProblems.length,
        codingAttemptedCount: attemptedCount,
        interviewsCompletedCount: completedInterviews.length,
        avgInterviewScore,
        assessmentsCount: assessmentAttempts.length,
        avgAssessmentAccuracy,
        githubReposAnalyzed: user.githubAnalyses.length,
        roadmapProgressPct,
        creditsBalance: user.credits,
      },
      interviewTrends: completedInterviews.map((i) => ({
        date: new Date(i.createdAt).toLocaleDateString(),
        overall: i.overallScore || 0,
        technical: i.technicalScore || 0,
        communication: i.communicationScore || 0,
      })),
      assessmentTrends: assessmentAttempts.map((a) => ({
        date: new Date(a.completedAt).toLocaleDateString(),
        category: a.category,
        accuracy: a.accuracyPct,
      })),
      skillBreakdown: user.githubSkillEvidences.map((ev) => ({
        skill: ev.skill,
        category: ev.category,
        evidenceLevel: ev.evidenceLevel,
      })),
      recentTransactions: user.creditTransactions,
    };
  }
}

export const analyticsService = new AnalyticsService();
