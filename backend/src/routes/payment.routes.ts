import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public / package info
router.get('/packages', (req, res, next) => paymentController.getPackages(req, res, next));

// Webhook endpoint (unauthenticated, HMAC verified)
router.post('/webhook', (req, res, next) => paymentController.webhook(req, res, next));

// Authenticated payment operations
router.post('/create-order', authenticateToken, (req, res, next) =>
  paymentController.createOrder(req, res, next)
);

router.post('/verify-payment', authenticateToken, (req, res, next) =>
  paymentController.verifyPayment(req, res, next)
);

export default router;
