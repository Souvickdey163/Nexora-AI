import { Router } from 'express';
import { learningController } from '../controllers/learning.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/topics', (req, res, next) => learningController.getTopics(req, res, next));
router.post('/progress/:topicId', (req, res, next) => learningController.toggleProgress(req, res, next));

export default router;
