import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { learningService } from '../services/learning.service';

export class LearningController {
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
