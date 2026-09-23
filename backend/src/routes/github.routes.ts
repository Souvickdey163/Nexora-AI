import { Router } from 'express';
import { githubController } from '../controllers/github.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { connectGitHubSchema } from '../schemas/github.schema';

const router = Router();

// Protect all routes with authentication
router.use(authenticateToken);

// Profile & Account Management
router.get('/profile', (req, res, next) => githubController.getProfile(req, res, next));
router.post('/connect', validateRequest(connectGitHubSchema), (req, res, next) => githubController.connect(req, res, next));
router.post('/disconnect', (req, res, next) => githubController.disconnect(req, res, next));

// Repository Discovery
router.get('/repositories', (req, res, next) => githubController.getRepositories(req, res, next));

// Repository Analysis (Explicit User Trigger)
router.post('/repositories/:owner/:repo/analyze', (req, res, next) => githubController.analyzeRepository(req, res, next));

// Resume ↔ GitHub Alignment
router.get('/resume-alignment', (req, res, next) => githubController.getResumeAlignment(req, res, next));

export default router;
