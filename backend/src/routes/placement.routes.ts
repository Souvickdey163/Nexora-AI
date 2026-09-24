import { Router } from 'express';
import { placementController } from '../controllers/placement.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/readiness', (req, res, next) => placementController.getReadiness(req, res, next));

export default router;
