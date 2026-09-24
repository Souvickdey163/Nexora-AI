import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { placementService } from '../services/placement.service';

export class PlacementController {
  async getReadiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const readiness = await placementService.getPlacementReadiness(req.user.userId);
      return res.status(200).json({ success: true, readiness });
    } catch (err) {
      return next(err);
    }
  }
}

export const placementController = new PlacementController();
