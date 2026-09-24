import { Router } from 'express';
import { creditController } from '../controllers/credit.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/balance', (req, res, next) => creditController.getBalance(req, res, next));
router.get('/history', (req, res, next) => creditController.getHistory(req, res, next));

export default router;
