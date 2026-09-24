import { Router } from 'express';
import multer from 'multer';
import { profileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max avatar size
});

// Stream public avatar images
router.get('/avatar/:filename', (req, res, next) => profileController.streamAvatar(req, res, next));

// Authenticated profile operations
router.use(authenticateToken);

router.get('/', (req, res, next) => profileController.getProfile(req, res, next));
router.put('/', (req, res, next) => profileController.updateProfile(req, res, next));
router.post('/avatar', upload.single('avatar'), (req, res, next) =>
  profileController.uploadAvatar(req, res, next)
);

export default router;
