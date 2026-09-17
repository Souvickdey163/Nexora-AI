import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { resumeService } from '../services/resume.service';
import { logger } from '../utils/logger';

export class ResumeController {
  // 1. POST /api/resumes
  public async createResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No PDF file uploaded. Please select a resume PDF file.',
        });
        return;
      }

      const title = req.body.title;
      const resume = await resumeService.createResumeWithInitialVersion(
        userId,
        file.buffer,
        file.originalname,
        file.mimetype,
        title
      );

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and processed successfully!',
        data: resume,
      });
    } catch (err) {
      next(err);
    }
  }

  // 2. POST /api/resumes/:resumeId/versions
  public async uploadVersion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No PDF file uploaded. Please select a resume PDF file.',
        });
        return;
      }

      const version = await resumeService.uploadResumeVersion(
        userId,
        resumeId,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      res.status(201).json({
        success: true,
        message: `Resume updated to Version ${version.versionNumber} successfully!`,
        data: version,
      });
    } catch (err) {
      next(err);
    }
  }

  // 3. GET /api/resumes
  public async listResumes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumes = await resumeService.listUserResumes(userId);
      res.status(200).json({
        success: true,
        data: resumes,
      });
    } catch (err) {
      next(err);
    }
  }

  // 4. GET /api/resumes/analytics/summary
  public async getAnalyticsSummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const summary = await resumeService.getAnalyticsSummary(userId);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (err) {
      next(err);
    }
  }

  // 5. GET /api/resumes/:resumeId
  public async getResumeDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;
      const resume = await resumeService.getResumeDetails(userId, resumeId);
      res.status(200).json({
        success: true,
        data: resume,
      });
    } catch (err) {
      next(err);
    }
  }

  // 6. GET /api/resumes/:resumeId/versions
  public async listVersions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;
      const resume = await resumeService.getResumeDetails(userId, resumeId);
      res.status(200).json({
        success: true,
        data: resume.versions,
      });
    } catch (err) {
      next(err);
    }
  }

  // 7. GET /api/resumes/:resumeId/versions/:versionId
  public async getVersionDetails(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { resumeId, versionId } = req.params;
      const version = await resumeService.getVersionDetails(userId, resumeId, versionId);
      res.status(200).json({
        success: true,
        data: version,
      });
    } catch (err) {
      next(err);
    }
  }

  // 8. GET /api/resumes/:resumeId/versions/:versionId/file (Secure Stream Download)
  public async downloadVersionFile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { resumeId, versionId } = req.params;
      const filePath = await resumeService.getVersionFilePath(userId, resumeId, versionId);
      
      res.sendFile(filePath);
    } catch (err) {
      next(err);
    }
  }

  // 9. POST /api/resumes/:resumeId/versions/:versionId/analyze
  public async analyzeVersion(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { resumeId, versionId } = req.params;
      const dto = req.body;

      const analysis = await resumeService.analyzeVersion(userId, resumeId, versionId, dto);
      res.status(200).json({
        success: true,
        message: 'Resume analysis completed successfully!',
        data: analysis,
      });
    } catch (err) {
      next(err);
    }
  }

  // 10. GET /api/resumes/:resumeId/analyses
  public async getAnalysisHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const history = await resumeService.getAnalysisHistory(userId, resumeId, page, limit);
      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }

  // 11. GET /api/resumes/:resumeId/analyses/:analysisId
  public async getSingleAnalysis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { resumeId, analysisId } = req.params;

      const analysis = await resumeService.getSingleAnalysis(userId, resumeId, analysisId);
      res.status(200).json({
        success: true,
        data: analysis,
      });
    } catch (err) {
      next(err);
    }
  }

  // 12. GET /api/resumes/:resumeId/progress
  public async getScoreProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;

      const progress = await resumeService.getScoreProgress(userId, resumeId);
      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (err) {
      next(err);
    }
  }

  // 13. DELETE /api/resumes/:resumeId
  public async deleteResume(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const resumeId = req.params.resumeId;

      await resumeService.deleteResume(userId, resumeId);
      res.status(200).json({
        success: true,
        message: 'Resume and associated resources deleted successfully.',
      });
    } catch (err) {
      next(err);
    }
  }
}

export const resumeController = new ResumeController();
