import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public categories info
router.get('/categories', (req, res, next) => assessmentController.getCategories(req, res, next));

// Authenticated assessment flow
router.use(authenticateToken);

router.get('/questions', (req, res, next) => assessmentController.startAssessment(req, res, next));
router.post('/start', (req, res, next) => assessmentController.startAssessment(req, res, next));
router.post('/submit', (req, res, next) => assessmentController.submitAssessment(req, res, next));
router.get('/history', (req, res, next) => assessmentController.getHistory(req, res, next));

export default router;
