import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { assessmentService } from '../services/assessment.service';

export class AssessmentController {
  async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const categories = await assessmentService.getCategories();
      return res.status(200).json({ success: true, categories });
    } catch (err) {
      return next(err);
    }
  }

  async getActiveSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const activeSession = await assessmentService.getActiveSession(req.user.userId);
      return res.status(200).json({ success: true, activeSession });
    } catch (err) {
      return next(err);
    }
  }

  async startAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const category = (req.body.category || req.query.category as string || 'DBMS & SQL');
      const difficulty = (req.body.difficulty || req.query.difficulty as string || 'INTERMEDIATE');
      const questionCount = typeof req.body.questionCount === 'number' ? req.body.questionCount : 10;

      const session = (await assessmentService.startAssessment(req.user.userId, category, difficulty, questionCount)) as any;
      return res.status(200).json({
        success: true,
        assessmentId: session.assessmentId,
        attemptId: session.assessmentId,
        category: session.category,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        answersData: session.answersData,
        questions: session.questions,
      });
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_CREDITS' || err.message?.includes('Insufficient credits')) {
        return res.status(402).json({
          success: false,
          error: err.message || 'Insufficient credits to start Diagnostic Skill Assessment.',
          code: 'INSUFFICIENT_CREDITS',
          requiredCredits: err.requiredCredits || 2,
          currentCredits: err.currentCredits || 0,
        });
      }
      return next(err);
    }
  }

  async saveAnswer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const assessmentId = req.params.assessmentId || req.body.assessmentId;
      const { questionId, selectedOptionIndex, timeSpentSeconds } = req.body;

      if (!assessmentId || !questionId || typeof selectedOptionIndex !== 'number') {
        return res.status(400).json({ success: false, error: 'Missing required parameters (assessmentId, questionId, selectedOptionIndex).' });
      }

      const result = await assessmentService.saveAnswer(
        req.user.userId,
        assessmentId,
        questionId,
        selectedOptionIndex,
        timeSpentSeconds || 0
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || 'Failed to save answer.' });
    }
  }

  async logIntegrityEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const assessmentId = req.params.assessmentId || req.body.assessmentId;
      const { eventType, details } = req.body;

      if (!assessmentId || !eventType) {
        return res.status(400).json({ success: false, error: 'Missing assessmentId or eventType.' });
      }

      const result = await assessmentService.logIntegrityEvent(req.user.userId, assessmentId, eventType, details);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async submitAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const assessmentId = req.params.assessmentId || req.body.assessmentId || req.body.attemptId;
      const finalAnswers = req.body.answers || req.body.finalAnswers;

      if (!assessmentId) {
        return res.status(400).json({ success: false, error: 'Assessment ID is required.' });
      }

      const result = await assessmentService.submitAssessment(
        req.user.userId,
        assessmentId,
        finalAnswers
      );

      return res.status(200).json({
        success: true,
        message: 'Assessment evaluated and saved successfully.',
        score: result.score,
        passed: result.score >= 70,
        result,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message || 'Failed to submit assessment.' });
    }
  }

  async getResult(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { assessmentId } = req.params;
      const result = await assessmentService.getAssessmentResult(assessmentId, req.user.userId);
      return res.status(200).json({ success: true, result });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message || 'Assessment result not found.' });
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const history = await assessmentService.getHistory(req.user.userId);
      return res.status(200).json({ success: true, attempts: history });
    } catch (err) {
      return next(err);
    }
  }

  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const analytics = await assessmentService.getAnalytics(req.user.userId);
      return res.status(200).json({ success: true, analytics });
    } catch (err) {
      return next(err);
    }
  }
}

export const assessmentController = new AssessmentController();
