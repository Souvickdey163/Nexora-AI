import { Router } from 'express';
import { quizController } from '../controllers/quiz.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticateToken, (req, res, next) =>
  quizController.generateMockTest(req, res, next)
);

router.post('/submit', authenticateToken, (req, res, next) =>
  quizController.submitMockTest(req, res, next)
);

router.get('/history', authenticateToken, (req, res, next) =>
  quizController.getMockTestHistory(req, res, next)
);

router.get('/categories', optionalAuthenticateToken, (req, res, next) =>
  quizController.getRecommendedTopics(req, res, next)
);

export default router;
