import { prisma } from '../config/database';

export class DashboardService {
  async getOverview(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        resumes: {
          include: {
            versions: {
              include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
              orderBy: { versionNumber: 'desc' },
              take: 1,
            },
          },
        },
        codingProgress: { where: { isSolved: true } },
        interviews: { where: { status: 'COMPLETED' }, orderBy: { completedAt: 'desc' } },
        githubAnalyses: { orderBy: { createdAt: 'desc' } },
        githubAccount: true,
        roadmaps: { where: { status: 'ACTIVE' }, include: { milestones: true }, take: 1 },
        activities: { orderBy: { createdAt: 'desc' }, take: 5 },
        notifications: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const targetRole = user.profile?.targetRole || 'Software Engineer';
    const latestAnalysis = user.resumes[0]?.versions[0]?.analyses[0];
    const resumeScore = latestAnalysis?.overallScore ?? null;

    const solvedCount = user.codingProgress.length;
    const completedInterviews = user.interviews;
    const avgInterviewScore =
      completedInterviews.length > 0
        ? Math.round(
            completedInterviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) /
              completedInterviews.length
          )
        : null;

    const activeRoadmap = user.roadmaps[0];
    const roadmapProgressPct = activeRoadmap?.progressPct ?? 0;

    // Determine top 3 recommended actions for today
    const todayActions: Array<{ id: string; title: string; subtitle: string; link: string }> = [];

    if (resumeScore === null || resumeScore < 75) {
      todayActions.push({
        id: 'action-resume',
        title: 'Optimize Resume ATS Alignment',
        subtitle: resumeScore === null ? 'Upload your resume to calculate ATS score' : `Current score: ${resumeScore}%. Target: 85%+`,
        link: '/features/resume',
      });
    }

    if (solvedCount < 15) {
      todayActions.push({
        id: 'action-coding',
        title: 'Practice Algorithmic Coding Problems',
        subtitle: `Solved: ${solvedCount}/15 target. Try Arrays & Sliding Window.`,
        link: '/features/coding',
      });
    }

    if (completedInterviews.length === 0) {
      todayActions.push({
        id: 'action-interview',
        title: 'Complete 1 AI Mock Interview Session',
        subtitle: 'Test technical depth and receive STAR behavioral feedback.',
        link: '/features/interview',
      });
    }

    if (todayActions.length < 3) {
      todayActions.push({
        id: 'action-github',
        title: 'Analyze GitHub Repository Code Signals',
        subtitle: 'Audit code organization and generate architectural evidence.',
        link: '/features/github',
      });
    }

    const unreadNotificationsCount = user.notifications.filter((n) => !n.isRead).length;

    return {
      user: {
        id: user.id,
        name: user.name || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        avatar: user.avatar,
        avatarUrl: user.avatar,
        credits: user.credits,
      },
      stats: {
        credits: user.credits,
        interviewsCompleted: completedInterviews.length,
        codingSolved: solvedCount,
        resumesAnalyzed: user.resumes.length,
        activeRoadmapProgress: roadmapProgressPct,
        placementScore: 85,
        profileCompletion: user.profile ? 90 : 50,
      },
      targetRole,
      todayActions: todayActions.slice(0, 3),
      roadmap: {
        hasActive: Boolean(activeRoadmap),
        progressPct: roadmapProgressPct,
        targetRole: activeRoadmap?.targetRole || targetRole,
      },
      resume: {
        hasResume: user.resumes.length > 0,
        overallScore: resumeScore,
        status: resumeScore !== null ? (resumeScore >= 75 ? 'ATS Optimized' : 'Needs Review') : 'No Upload',
      },
      coding: {
        solvedCount,
      },
      interview: {
        completedCount: completedInterviews.length,
        avgScore: avgInterviewScore,
      },
      github: {
        connected: Boolean(user.githubAccount),
        reposAnalyzedCount: user.githubAnalyses.length,
      },
      recentActivities: user.activities,
      notifications: {
        unreadCount: unreadNotificationsCount,
        recent: user.notifications,
      },
    };
  }
}

export const dashboardService = new DashboardService();
