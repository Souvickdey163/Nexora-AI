import { Request, Response } from 'express';
import { z } from 'zod';
import { placementReadinessService } from '../services/placementReadiness.service';
import { TARGET_ROLES, COMPANY_CATEGORIES } from '../config/placement.config';
import { logger } from '../utils/logger';

const assessSchema = z.object({
  targetRole: z.string().min(1).max(100).optional().default('Software Engineer'),
  companyCategory: z.string().min(1).max(100).optional().default('Product Technology'),
  forceRefresh: z.boolean().optional().default(false),
});

export class PlacementController {
  /**
   * POST /api/placement/assess
   * Calculate or recalculate placement readiness assessment
   */
  async assessReadiness(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const parseResult = assessSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input parameters.',
          details: parseResult.error.format(),
        });
      }

      const { targetRole, companyCategory, forceRefresh } = parseResult.data;

      const assessment = await placementReadinessService.calculateAssessment(
        userId,
        targetRole,
        companyCategory,
        forceRefresh
      );

      return res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.assessReadiness: ${err.message}`);
      if (err.statusCode === 402 || err.code === 'INSUFFICIENT_CREDITS') {
        return res.status(402).json({
          success: false,
          error: err.message || 'Insufficient credits to generate placement assessment.',
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: err.requiredCredits || 2,
          currentCredits: err.currentCredits || 0,
        });
      }
      return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Internal server error while calculating placement readiness.',
      });
    }
  }

  /**
   * GET /api/placement/current
   * Retrieve current latest assessment (costs 0 credits)
   */
  async getCurrentAssessment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const assessment = await placementReadinessService.getCurrentAssessment(userId);

      return res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.getCurrentAssessment: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve current placement assessment.',
      });
    }
  }

  /**
   * GET /api/placement/history
   * Retrieve historical placement assessments
   */
  async getAssessmentHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const history = await placementReadinessService.getAssessmentHistory(userId, Math.min(50, Math.max(1, limit)));

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.getAssessmentHistory: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve placement assessment history.',
      });
    }
  }

  /**
   * GET /api/placement/:assessmentId
   * Retrieve specific assessment by ID ensuring user ownership
   */
  async getAssessmentById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const { assessmentId } = req.params;
      const assessment = await placementReadinessService.getAssessmentById(userId, assessmentId);

      return res.status(200).json({
        success: true,
        data: assessment,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.getAssessmentById: ${err.message}`);
      return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Failed to retrieve assessment.',
      });
    }
  }

  /**
   * PATCH /api/placement/:assessmentId/recommendations/:recommendationId
   * Toggle completion of a placement recommendation
   */
  async toggleRecommendation(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const { assessmentId, recommendationId } = req.params;
      const { completed } = req.body;

      const updatedRec = await placementReadinessService.toggleRecommendationCompleted(
        userId,
        assessmentId,
        recommendationId,
        completed
      );

      return res.status(200).json({
        success: true,
        data: updatedRec,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.toggleRecommendation: ${err.message}`);
      return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Failed to update recommendation status.',
      });
    }
  }

  /**
   * GET /api/placement/summary
   * Retrieve high-level placement status summary
   */
  async getSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized user context.' });
      }

      const summary = await placementReadinessService.getSummary(userId);

      return res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err: any) {
      logger.error(`Error in PlacementController.getSummary: ${err.message}`);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve placement summary.',
      });
    }
  }
}

export const placementController = new PlacementController();
