import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { aboutService } from '../services/about.service';

export class AboutController {
  /**
   * GET /api/about
   * Public endpoint returning dynamic platform status, modules, tech stack & security overview
   */
  async getPlatformInfo(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = await aboutService.getPlatformInfo();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/about/me
   * Authenticated endpoint returning user's actual database career summary
   */
  async getUserSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required to view your career summary.',
        });
      }

      const summary = await aboutService.getUserCareerSummary(req.user.userId);
      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const aboutController = new AboutController();
