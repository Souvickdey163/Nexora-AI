import { Router } from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { interviewController } from '../controllers/interview.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for recordings
});

// Rate limiting
const createInterviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many interview creation attempts. Please wait a minute.' },
});

const uploadRecordingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many upload attempts. Please wait a minute.' },
});

// All interview endpoints require authentication
router.use(authenticateToken);

// Interview CRUD & flow
router.post('/create', createInterviewLimiter, (req, res) => interviewController.createInterview(req, res));
router.get('/', (req, res) => interviewController.listInterviews(req, res));
router.get('/:id', (req, res) => interviewController.getInterview(req, res));
router.post('/:id/answers', (req, res) => interviewController.submitAnswer(req, res));
router.post('/:id/next-question', (req, res) => interviewController.getNextQuestion(req, res));
router.post('/:id/finish', (req, res) => interviewController.finishInterview(req, res));
router.post('/:id/events', (req, res) => interviewController.logEvent(req, res));
router.delete('/:id', (req, res) => interviewController.deleteInterview(req, res));

// Video Recording routes
router.post('/:id/recording', uploadRecordingLimiter, upload.single('video'), (req, res) =>
  interviewController.uploadRecording(req, res)
);
router.get('/:id/recording', (req, res) => interviewController.streamRecording(req, res));

export default router;
