import { Router } from 'express';
import { roadmapController } from '../controllers/roadmap.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/active', (req, res, next) => roadmapController.getActiveRoadmap(req, res, next));
router.post('/generate', (req, res, next) => roadmapController.generateRoadmap(req, res, next));
router.patch('/milestones/:id/toggle', (req, res, next) => roadmapController.toggleMilestone(req, res, next));

export default router;
