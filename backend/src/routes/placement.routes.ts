import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { placementController } from '../controllers/placement.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rate limiting for assessment calculation (max 10 calculations per minute)
const assessLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Too many placement assessment calculations. Please wait a minute before retrying.',
  },
});

// All placement routes require authentication
router.use(authenticateToken);

router.post('/assess', assessLimiter, (req, res) => placementController.assessReadiness(req, res));
router.get('/current', (req, res) => placementController.getCurrentAssessment(req, res));
router.get('/history', (req, res) => placementController.getAssessmentHistory(req, res));
router.get('/summary', (req, res) => placementController.getSummary(req, res));
router.get('/:assessmentId', (req, res) => placementController.getAssessmentById(req, res));
router.patch('/:assessmentId/recommendations/:recommendationId', (req, res) =>
  placementController.toggleRecommendation(req, res)
);

export default router;
