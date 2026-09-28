import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { optionalAuthenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthenticateToken, (req, res, next) => jobController.getJobs(req, res, next));
router.get('/recommended', optionalAuthenticateToken, (req, res, next) =>
  jobController.getRecommendedJobs(req, res, next)
);
router.get('/:id', optionalAuthenticateToken, (req, res, next) => jobController.getJobById(req, res, next));

export default router;
