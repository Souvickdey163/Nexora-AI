import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { codingController } from '../controllers/coding.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Rate Limiters for execution endpoints
const runRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max 20 runs per minute
  message: { error: 'Rate limit exceeded for code execution. Please wait a minute before running code again.' },
});

const submitRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // max 15 submissions per minute
  message: { error: 'Rate limit exceeded for code submissions. Please wait a minute before submitting code again.' },
});

// Optional auth for problem listing & problem detail so public visitors can browse problems
// Strict auth for running, submitting, submissions history, stats, and mentor
router.get('/problems', (req, res, next) => {
  // If authorization header is present, authenticate token to attach user profile
  if (req.headers.authorization) {
    return authenticateToken(req, res, () => codingController.listProblems(req, res));
  }
  return codingController.listProblems(req, res);
});

router.get('/problems/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateToken(req, res, () => codingController.getProblem(req, res));
  }
  return codingController.getProblem(req, res);
});

// Authenticated Endpoints
router.use(authenticateToken);

router.post('/problems/:id/run', runRateLimiter, (req, res) => codingController.runCode(req, res));
router.post('/problems/:id/submit', submitRateLimiter, (req, res) => codingController.submitCode(req, res));

router.get('/submissions', (req, res) => codingController.listSubmissions(req, res));
router.get('/submissions/:id', (req, res) => codingController.getSubmission(req, res));
router.get('/stats', (req, res) => codingController.getStats(req, res));
router.get('/progress', (req, res) => codingController.getStats(req, res)); // Alias
router.post('/mentor', (req, res) => codingController.queryMentor(req, res));

export default router;
