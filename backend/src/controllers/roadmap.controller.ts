import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { roadmapService } from '../services/roadmap.service';

export class RoadmapController {
  async getActiveRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const roadmap = await roadmapService.getActiveRoadmap(req.user.userId);
      return res.status(200).json({ success: true, roadmap });
    } catch (err) {
      return next(err);
    }
  }

  async generateRoadmap(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { targetRole, experienceLevel } = req.body;
      const roadmap = await roadmapService.generateRoadmap(req.user.userId, targetRole, experienceLevel);
      return res.status(201).json({
        success: true,
        message: 'Career roadmap generated successfully!',
        roadmap,
      });
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json({
          success: false,
          error: err.message,
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: err.requiredCredits,
          currentCredits: err.currentCredits,
        });
      }
      return next(err);
    }
  }

  async toggleMilestone(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { id } = req.params;
      const roadmap = await roadmapService.toggleMilestone(req.user.userId, id);
      return res.status(200).json({
        success: true,
        message: 'Milestone status updated.',
        roadmap,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const roadmapController = new RoadmapController();
