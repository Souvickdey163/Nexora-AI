import { Router } from 'express';
import { learningController } from '../controllers/learning.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Phase 1: freeCodeCamp Curriculum route
router.get('/freecodecamp', optionalAuthenticateToken, (req, res, next) =>
  learningController.getFreeCodeCamp(req, res, next)
);

// Phase 4: Unified Learning Resources endpoint (PostgreSQL + recommendations)
router.get('/resources', optionalAuthenticateToken, (req, res, next) =>
  learningController.getResources(req, res, next)
);

// Phase 3: Synchronization endpoint
router.post('/sync', authenticateToken, (req, res, next) =>
  learningController.syncResources(req, res, next)
);
router.post('/sync/freecodecamp', authenticateToken, (req, res, next) =>
  learningController.syncResources(req, res, next)
);

// Progress toggle endpoint
router.post('/resources/:resourceId/progress', authenticateToken, (req, res, next) =>
  learningController.toggleResourceProgress(req, res, next)
);

// Legacy backward-compatibility routes
router.get('/topics', authenticateToken, (req, res, next) =>
  learningController.getTopics(req, res, next)
);
router.post('/progress/:topicId', authenticateToken, (req, res, next) =>
  learningController.toggleProgress(req, res, next)
);

export default router;
