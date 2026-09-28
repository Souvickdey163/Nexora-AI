import { prisma } from '../config/database';
import { learningSyncService } from './learning-sync.service';
import { learningRecommendationService } from './learning-recommendation.service';
import { LearningResource, LearningResourceQueryParams } from '../types/learning.types';

export class LearningService {
  /**
   * Retrieves resources from PostgreSQL DB, applies filtering, user progress, and personalized recommendations.
   */
  async getResources(
    userId?: string,
    params: LearningResourceQueryParams = {}
  ): Promise<{
    resources: LearningResource[];
    recommendedForGaps: LearningResource[];
    missingSkills: string[];
    targetRole: string | null;
  }> {
    // Ensure database is populated with initial synced resources if empty
    await learningSyncService.ensureSyncedOnStartup();

    // Build database query filter
    const where: any = {};

    if (params.provider && params.provider.toLowerCase() !== 'all') {
      where.provider = { equals: params.provider, mode: 'insensitive' };
    }

    if (params.category && params.category.toLowerCase() !== 'all') {
      where.category = { equals: params.category, mode: 'insensitive' };
    }

    if (params.difficulty && params.difficulty.toLowerCase() !== 'all') {
      where.difficulty = { equals: params.difficulty, mode: 'insensitive' };
    }

    if (params.skill) {
      const s = params.skill.toLowerCase();
      where.skills = { has: s };
    }

    if (params.search && params.search.trim() !== '') {
      const q = params.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
        { skills: { has: q.toLowerCase() } },
      ];
    }

    // Fetch from PostgreSQL
    const dbResources = await prisma.learningResource.findMany({
      where,
      orderBy:
        params.sortBy === 'title'
          ? { title: 'asc' }
          : params.sortBy === 'category'
          ? { category: 'asc' }
          : params.sortBy === 'difficulty'
          ? { difficulty: 'asc' }
          : { createdAt: 'desc' },
      take: params.limit && params.limit > 0 ? params.limit : undefined,
    });

    // Attach user progress if logged in
    let userProgressMap = new Map<string, { isCompleted: boolean; isBookmarked: boolean }>();
    if (userId) {
      const userProgress = await prisma.userLearningResourceProgress.findMany({
        where: { userId },
      });
      userProgress.forEach((p) => {
        userProgressMap.set(p.resourceId, {
          isCompleted: p.isCompleted,
          isBookmarked: p.isBookmarked,
        });
      });
    }

    const mappedResources: LearningResource[] = dbResources.map((r) => {
      const p = userProgressMap.get(r.id);
      return {
        id: r.id,
        sourceId: r.sourceId,
        provider: r.provider,
        title: r.title,
        description: r.description || undefined,
        category: r.category,
        skills: r.skills,
        resourceType: r.resourceType as any,
        url: r.url,
        difficulty: (r.difficulty as any) || undefined,
        isCompleted: p?.isCompleted ?? false,
        isBookmarked: p?.isBookmarked ?? false,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });

    // Run personalized recommendation scoring if user is logged in
    if (userId) {
      const rec = await learningRecommendationService.getPersonalizedRecommendations(
        userId,
        mappedResources
      );
      return {
        resources: rec.scoredResources,
        recommendedForGaps: rec.recommendedForGaps,
        missingSkills: rec.missingSkills,
        targetRole: rec.targetRole,
      };
    }

    return {
      resources: mappedResources,
      recommendedForGaps: [],
      missingSkills: [],
      targetRole: null,
    };
  }

  /**
   * Toggles completion / bookmark state for a resource
   */
  async toggleResourceProgress(
    userId: string,
    resourceId: string,
    data: { isCompleted?: boolean; isBookmarked?: boolean }
  ) {
    const existing = await prisma.userLearningResourceProgress.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    });

    const newCompleted =
      data.isCompleted !== undefined ? data.isCompleted : existing?.isCompleted ?? false;
    const newBookmarked =
      data.isBookmarked !== undefined ? data.isBookmarked : existing?.isBookmarked ?? false;

    return prisma.userLearningResourceProgress.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      create: {
        userId,
        resourceId,
        isCompleted: newCompleted,
        isBookmarked: newBookmarked,
        completedAt: newCompleted ? new Date() : null,
      },
      update: {
        isCompleted: newCompleted,
        isBookmarked: newBookmarked,
        completedAt: newCompleted ? new Date() : null,
      },
    });
  }

  // Legacy getTopics & toggleProgress support for backwards compatibility
  async getTopics(userId: string, category?: string) {
    const res = await this.getResources(userId, { category });
    return res.resources.map((r) => ({
      ...r,
      slug: r.sourceId || r.id,
      estimatedMinutes: 45,
      resources: [{ title: r.title, url: r.url, type: r.resourceType, isFree: true }],
    }));
  }

  async toggleProgress(
    userId: string,
    topicId: string,
    data: { isCompleted?: boolean; isBookmarked?: boolean }
  ) {
    return this.toggleResourceProgress(userId, topicId, data);
  }
}

export const learningService = new LearningService();
