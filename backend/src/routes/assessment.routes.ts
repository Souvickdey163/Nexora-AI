import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public categories info
router.get('/categories', (req, res, next) => assessmentController.getCategories(req, res, next));

// Authenticated assessment flow
router.use(authenticateToken);

router.get('/active', (req, res, next) => assessmentController.getActiveSession(req, res, next));
router.get('/questions', (req, res, next) => assessmentController.startAssessment(req, res, next));
router.post('/start', (req, res, next) => assessmentController.startAssessment(req, res, next));

router.post('/:assessmentId/answers', (req, res, next) => assessmentController.saveAnswer(req, res, next));
router.post('/:assessmentId/integrity-event', (req, res, next) => assessmentController.logIntegrityEvent(req, res, next));
router.post('/:assessmentId/submit', (req, res, next) => assessmentController.submitAssessment(req, res, next));

// Legacy submit compatibility route
router.post('/submit', (req, res, next) => assessmentController.submitAssessment(req, res, next));

router.get('/history', (req, res, next) => assessmentController.getHistory(req, res, next));
router.get('/analytics', (req, res, next) => assessmentController.getAnalytics(req, res, next));
router.get('/:assessmentId/result', (req, res, next) => assessmentController.getResult(req, res, next));

export default router;
