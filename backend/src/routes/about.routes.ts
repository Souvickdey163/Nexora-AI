import { Router } from 'express';
import { aboutController } from '../controllers/about.controller';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public endpoint for platform overview, tech stack, modules & security
router.get('/', aboutController.getPlatformInfo.bind(aboutController));

// Authenticated user career summary endpoint
router.get('/me', authenticateToken, aboutController.getUserSummary.bind(aboutController));

export default router;
