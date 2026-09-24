import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const overview = await dashboardService.getOverview(req.user.userId);
      return res.status(200).json({ success: true, overview });
    } catch (err) {
      return next(err);
    }
  }
}

export const dashboardController = new DashboardController();
