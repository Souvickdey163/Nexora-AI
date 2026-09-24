import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/overview', (req, res, next) => dashboardController.getOverview(req, res, next));

export default router;
