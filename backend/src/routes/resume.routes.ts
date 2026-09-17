import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { resumeController } from '../controllers/resume.controller';
import { createResumeSchema, analyzeResumeSchema } from '../schemas/resume.schema';
import { env } from '../config/env';

const router = Router();

// Multer memory storage configuration (10 MB max file size)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: (env.RESUME_MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
  },
});

const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

// Rate Limiters
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTestEnv ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many resume upload requests. Please try again later.',
  },
});

const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isTestEnv ? 1000 : (env.RESUME_ANALYSIS_RATE_LIMIT || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: `Analysis limit reached (${env.RESUME_ANALYSIS_RATE_LIMIT || 10} per hour). Please try again later.`,
  },
});

// Protect ALL Resume Intelligence Endpoints
router.use(authenticateToken);

// 1. Dashboard Analytics Summary
router.get('/analytics/summary', resumeController.getAnalyticsSummary);

// 2. Create Resume (Upload initial version)
router.post(
  '/',
  uploadLimiter,
  upload.single('file'),
  validateRequest(createResumeSchema),
  resumeController.createResume
);

// 3. List User Resumes
router.get('/', resumeController.listResumes);

// 4. Get Resume Details & versions list
router.get('/:resumeId', resumeController.getResumeDetails);

// 5. Delete Resume
router.delete('/:resumeId', resumeController.deleteResume);

// 6. Upload new version for existing resume
router.post(
  '/:resumeId/versions',
  uploadLimiter,
  upload.single('file'),
  resumeController.uploadVersion
);

// 7. List versions of a resume
router.get('/:resumeId/versions', resumeController.listVersions);

// 8. Get specific version details
router.get('/:resumeId/versions/:versionId', resumeController.getVersionDetails);

// 9. Download/Stream version PDF file securely
router.get('/:resumeId/versions/:versionId/file', resumeController.downloadVersionFile);

// 10. Trigger AI analysis for a version
router.post(
  '/:resumeId/versions/:versionId/analyze',
  analysisLimiter,
  validateRequest(analyzeResumeSchema),
  resumeController.analyzeVersion
);

// 11. Get analysis history for a resume (paginated)
router.get('/:resumeId/analyses', resumeController.getAnalysisHistory);

// 12. Get single specific historical analysis
router.get('/:resumeId/analyses/:analysisId', resumeController.getSingleAnalysis);

// 13. Get score progression history over time
router.get('/:resumeId/progress', resumeController.getScoreProgress);

export default router;
