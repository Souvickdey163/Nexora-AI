import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { activityService } from '../services/activity.service';

export class ActivityController {
  async getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const activities = await activityService.getUserActivities(req.user.userId);
      return res.status(200).json({ success: true, activities });
    } catch (err) {
      return next(err);
    }
  }
}

export const activityController = new ActivityController();
