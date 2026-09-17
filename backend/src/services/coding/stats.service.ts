import { prisma } from '../../config/database';
import { Difficulty, SubmissionStatus } from '@prisma/client';
import { CodingStatsDTO } from './types';

export class StatsService {
  /**
   * Calculate real-time coding progress statistics for an authenticated user.
   */
  public async getUserStats(userId: string): Promise<CodingStatsDTO> {
    const [
      totalProblemsCount,
      difficultyCounts,
      topicCounts,
      userProgress,
      userSubmissionsCount,
      acceptedSubmissionsCount,
      recentAcceptedSubmissions,
    ] = await Promise.all([
      prisma.codingProblem.count(),
      prisma.codingProblem.groupBy({
        by: ['difficulty'],
        _count: { id: true },
      }),
      prisma.codingProblem.groupBy({
        by: ['topic'],
        _count: { id: true },
      }),
      prisma.codingProgress.findMany({
        where: { userId },
        include: {
          problem: {
            select: { difficulty: true, topic: true },
          },
        },
      }),
      prisma.codingSubmission.count({ where: { userId } }),
      prisma.codingSubmission.count({ where: { userId, status: SubmissionStatus.ACCEPTED } }),
      prisma.codingSubmission.findMany({
        where: { userId, status: SubmissionStatus.ACCEPTED },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    let totalSolved = 0;
    let totalAttempted = userProgress.length;

    const easySolvedMap = new Map<string, boolean>();
    const medSolvedMap = new Map<string, boolean>();
    const hardSolvedMap = new Map<string, boolean>();

    const topicSolvedMap = new Map<string, number>();

    userProgress.forEach((p) => {
      if (p.isSolved) {
        totalSolved++;
        if (p.problem.difficulty === Difficulty.EASY) easySolvedMap.set(p.problemId, true);
        if (p.problem.difficulty === Difficulty.MEDIUM) medSolvedMap.set(p.problemId, true);
        if (p.problem.difficulty === Difficulty.HARD) hardSolvedMap.set(p.problemId, true);

        const currentTopicCount = topicSolvedMap.get(p.problem.topic) || 0;
        topicSolvedMap.set(p.problem.topic, currentTopicCount + 1);
      }
    });

    // Accuracy
    const accuracy = userSubmissionsCount > 0 ? Math.round((acceptedSubmissionsCount / userSubmissionsCount) * 100) : 0;

    // Difficulty breakdown
    let totalEasy = 0, totalMed = 0, totalHard = 0;
    difficultyCounts.forEach((dc) => {
      if (dc.difficulty === Difficulty.EASY) totalEasy = dc._count.id;
      if (dc.difficulty === Difficulty.MEDIUM) totalMed = dc._count.id;
      if (dc.difficulty === Difficulty.HARD) totalHard = dc._count.id;
    });

    const difficultyBreakdown = {
      easy: { solved: easySolvedMap.size, total: totalEasy },
      medium: { solved: medSolvedMap.size, total: totalMed },
      hard: { solved: hardSolvedMap.size, total: totalHard },
    };

    // Topic performance
    const topicPerformance = topicCounts.map((tc) => {
      const solved = topicSolvedMap.get(tc.topic) || 0;
      const total = tc._count.id;
      return {
        topic: tc.topic,
        solved,
        total,
        accuracy: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });

    // Calculate streak
    const currentStreak = this.calculateStreak(recentAcceptedSubmissions.map((s) => s.createdAt));

    // Recommend topic based on user progress
    // Find topics where solved < total, sorted by lowest completion / accuracy
    const incompleteTopics = [...topicPerformance]
      .filter((t) => t.solved < t.total)
      .sort((a, b) => a.accuracy - b.accuracy || a.solved - b.solved);

    let recommendedTopic = incompleteTopics[0]?.topic || 'Arrays';
    let recommendedReason = incompleteTopics.length > 0
      ? `Focus on your weak domain "${recommendedTopic}" to boost technical mastery.`
      : 'Explore foundational algorithms to maintain your practice streak.';

    const solvedProblemIds = new Set(userProgress.filter((p) => p.isSolved).map((p) => p.problemId));

    const recProblemsRaw = await prisma.codingProblem.findMany({
      where: {
        topic: { equals: recommendedTopic, mode: 'insensitive' },
        id: { notIn: Array.from(solvedProblemIds) },
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        topic: true,
        tags: true,
      },
      orderBy: { difficulty: 'asc' },
    });

    return {
      totalSolved,
      totalAttempted,
      totalProblems: totalProblemsCount,
      accuracy,
      currentStreak,
      difficultyBreakdown,
      topicPerformance,
      recommendedTopic,
      recommendedReason,
      recommendedProblems: recProblemsRaw,
    };
  }

  private calculateStreak(submissionDates: Date[]): number {
    if (submissionDates.length === 0) return 0;

    const uniqueDays = new Set<string>();
    submissionDates.forEach((d) => {
      const dayStr = d.toISOString().split('T')[0];
      uniqueDays.add(dayStr);
    });

    const sortedDays = Array.from(uniqueDays).sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if active today or yesterday
    if (!sortedDays.includes(todayStr) && !sortedDays.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let curr = new Date(sortedDays[0]);

    for (let i = 0; i < sortedDays.length; i++) {
      const dayDate = new Date(sortedDays[i]);
      const diffDays = Math.round((curr.getTime() - dayDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays <= 1) {
        streak++;
        curr = dayDate;
      } else {
        break;
      }
    }

    return streak;
  }
}

export const statsService = new StatsService();
