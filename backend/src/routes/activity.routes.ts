import { Router } from 'express';
import { activityController } from '../controllers/activity.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/', (req, res, next) => activityController.getActivities(req, res, next));

export default router;
