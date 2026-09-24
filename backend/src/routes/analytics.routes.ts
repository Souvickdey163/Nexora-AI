import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/dashboard', (req, res, next) => analyticsController.getDashboardAnalytics(req, res, next));

export default router;
