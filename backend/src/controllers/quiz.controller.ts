import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { quizService } from '../services/quiz.service';

export class QuizController {
  /**
   * POST /api/quiz/generate
   * Generates a new MCQ mock test with questions from QuizAPI
   */
  async generateMockTest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { category, difficulty, limit, type, tags } = req.body;
      const testSession = await quizService.generateMockTest(req.user.userId, {
        category,
        difficulty,
        limit,
        type,
        tags,
      });

      return res.status(200).json({
        success: true,
        testSession,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/quiz/submit
   * Submits user answers and evaluates test result
   */
  async submitMockTest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const { testId, userAnswers } = req.body;
      if (!testId) {
        return res.status(400).json({ success: false, error: 'Missing testId' });
      }

      const report = await quizService.submitMockTest(req.user.userId, {
        testId,
        userAnswers: userAnswers || {},
      });

      return res.status(200).json(report);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/quiz/history
   * Returns past completed mock test attempts for authenticated user
   */
  async getMockTestHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const history = await quizService.getMockTestHistory(req.user.userId);
      return res.status(200).json({
        success: true,
        count: history.length,
        history,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/quiz/categories
   * Returns categories and resume-recommended topics
   */
  async getRecommendedTopics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId || 'guest';
      const topics = await quizService.getRecommendedTopics(userId);
      return res.status(200).json({
        success: true,
        ...topics,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const quizController = new QuizController();
