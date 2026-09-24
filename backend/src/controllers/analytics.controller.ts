import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
  async getDashboardAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const analytics = await analyticsService.getDashboardAnalytics(req.user.userId);
      return res.status(200).json({ success: true, analytics });
    } catch (err) {
      return next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
