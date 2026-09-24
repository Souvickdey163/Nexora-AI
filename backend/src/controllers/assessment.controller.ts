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

  async startAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const category = (req.query.category as string) || req.body.category || 'DBMS & SQL';
      const difficulty = (req.query.difficulty as string) || req.body.difficulty || 'MEDIUM';

      const session = await assessmentService.startAssessment(req.user.userId, category, difficulty);
      const attemptId = `attempt_${Date.now()}`;
      return res.status(200).json({
        success: true,
        attemptId,
        questions: session.questions,
        category: session.category,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
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

  async submitAssessment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { attemptId, answers } = req.body;
      const category = req.body.category || 'DBMS & SQL';
      const difficulty = req.body.difficulty || 'MEDIUM';
      const timeTakenSeconds = req.body.timeTakenSeconds || 300;

      const formattedAnswers = Array.isArray(answers)
        ? answers.map((a: any) => ({
            questionId: a.questionId || a.id,
            selectedOptionIndex: typeof a.selectedOptionIndex === 'number' ? a.selectedOptionIndex : (typeof a.selectedOption === 'number' ? a.selectedOption : 0),
          }))
        : [];

      const result = await assessmentService.submitAssessment(
        req.user.userId,
        category,
        difficulty,
        formattedAnswers,
        timeTakenSeconds
      );

      return res.status(200).json({
        success: true,
        message: 'Assessment submitted and evaluated successfully!',
        score: result.score,
        passed: result.score >= 70,
        result,
      });
    } catch (err) {
      return next(err);
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
}

export const assessmentController = new AssessmentController();
