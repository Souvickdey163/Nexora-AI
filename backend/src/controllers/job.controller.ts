import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { jobService } from '../services/jobs/job.service';

export class JobController {
  /**
   * GET /api/jobs
   * Public or authenticated endpoint returning normalized job opportunities
   */
  async getJobs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const q = req.query.q as string | undefined;
      const location = req.query.location as string | undefined;
      const daysStr = req.query.days as string | undefined;
      const limitStr = req.query.limit as string | undefined;
      const remote = req.query.remote as string | undefined;
      const employmentType = req.query.employmentType as string | undefined;

      const jobs = await jobService.getJobs({
        q,
        location,
        days: daysStr ? parseInt(daysStr, 10) : undefined,
        limit: limitStr ? parseInt(limitStr, 10) : 20,
        remote,
        employmentType,
      });

      return res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/jobs/recommended
   * Authenticated endpoint calculating personalized job match scores & missing skills
   */
  async getRecommendedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId || 'guest';
      const q = req.query.q as string | undefined;
      const location = req.query.location as string | undefined;

      const result = await jobService.getRecommendedJobs(userId, { q, location });

      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/jobs/:id
   * Endpoint returning single job detail
   */
  async getJobById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || 'guest';

      const recResult = await jobService.getRecommendedJobs(userId, {});
      const found = recResult.allJobs.find((j) => j.id === id);

      if (!found) {
        return res.status(404).json({ success: false, error: 'Job opening not found' });
      }

      return res.status(200).json({
        success: true,
        job: found,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const jobController = new JobController();
