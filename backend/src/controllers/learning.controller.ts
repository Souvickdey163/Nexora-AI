import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { freeCodeCampService } from '../services/freecodecamp.service';
import { learningService } from '../services/learning.service';
import { learningSyncService } from '../services/learning-sync.service';

export class LearningController {
  /**
   * GET /api/learning/freecodecamp
   * Phase 1: Directly fetches freeCodeCamp GraphQL curriculum resources (backend service)
   */
  async getFreeCodeCamp(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const limitStr = req.query.limit as string | undefined;
      const limit = limitStr ? parseInt(limitStr, 10) : undefined;

      const resources = await freeCodeCampService.fetchCurriculum({
        category,
        search,
        limit: isNaN(limit!) ? undefined : limit,
      });

      return res.status(200).json({
        success: true,
        provider: 'freeCodeCamp',
        count: resources.length,
        resources,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/learning/resources
   * Phase 4 & 5 & 7: Unified backend endpoint returning normalized resources from PostgreSQL,
   * including progress and skill gap recommendations.
   */
  async getResources(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const provider = req.query.provider as string | undefined;
      const difficulty = req.query.difficulty as string | undefined;
      const skill = req.query.skill as string | undefined;
      const limitStr = req.query.limit as string | undefined;
      const sortBy = req.query.sortBy as any;

      const limit = limitStr ? parseInt(limitStr, 10) : undefined;

      const result = await learningService.getResources(userId, {
        category,
        search,
        provider,
        difficulty,
        skill,
        limit: isNaN(limit!) ? undefined : limit,
        sortBy,
      });

      return res.status(200).json({
        success: true,
        count: result.resources.length,
        targetRole: result.targetRole,
        missingSkills: result.missingSkills,
        recommendedForGaps: result.recommendedForGaps,
        resources: result.resources,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/learning/sync
   * Phase 3: Synchronizes provider resources into PostgreSQL
   */
  async syncResources(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const provider = (req.body.provider || req.query.provider || 'freeCodeCamp') as string;
      const result = await learningSyncService.syncResources(provider);

      return res.status(200).json({
        success: true,
        message: `Successfully synchronized ${result.syncedCount} resources from ${result.provider}.`,
        syncedCount: result.syncedCount,
        provider: result.provider,
        resources: result.resources,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/learning/resources/:resourceId/progress
   * Toggles completion / bookmark state for a resource
   */
  async toggleResourceProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { resourceId } = req.params;
      const isCompleted = req.body.completed ?? req.body.isCompleted;
      const isBookmarked = req.body.bookmarked ?? req.body.isBookmarked;

      const progress = await learningService.toggleResourceProgress(req.user.userId, resourceId, {
        isCompleted,
        isBookmarked,
      });

      return res.status(200).json({
        success: true,
        message: 'Resource progress updated.',
        progress,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Legacy endpoint handlers
   */
  async getTopics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const category = req.query.category as string | undefined;
      const topics = await learningService.getTopics(req.user.userId, category);
      return res.status(200).json({ success: true, topics });
    } catch (err) {
      return next(err);
    }
  }

  async toggleProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { topicId } = req.params;
      const isCompleted = req.body.completed ?? req.body.isCompleted;
      const isBookmarked = req.body.bookmarked ?? req.body.isBookmarked;

      const progress = await learningService.toggleProgress(req.user.userId, topicId, {
        isCompleted,
        isBookmarked,
      });

      return res.status(200).json({ success: true, message: 'Progress updated.', progress });
    } catch (err) {
      return next(err);
    }
  }
}

export const learningController = new LearningController();
