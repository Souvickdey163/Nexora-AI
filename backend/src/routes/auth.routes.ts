import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter, loginLimiter, otpLimiter } from '../middleware/rateLimit.middleware';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';

const router = Router();

// Registration & Login
router.post(
  '/register',
  authLimiter,
  validateRequest(registerSchema),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  loginLimiter,
  validateRequest(loginSchema),
  (req, res, next) => authController.login(req, res, next)
);

router.post(
  '/logout',
  authenticateToken,
  (req, res, next) => authController.logout(req, res, next)
);

router.post(
  '/refresh',
  validateRequest(refreshTokenSchema),
  (req, res, next) => authController.refresh(req, res, next)
);

// Email Verification OTP
router.post(
  '/send-verification-otp',
  otpLimiter,
  validateRequest(resendOtpSchema),
  (req, res, next) => authController.resendVerificationOtp(req, res, next)
);

router.post(
  '/verify-email',
  otpLimiter,
  validateRequest(verifyOtpSchema),
  (req, res, next) => authController.verifyEmail(req, res, next)
);

router.post(
  '/resend-verification-otp',
  otpLimiter,
  validateRequest(resendOtpSchema),
  (req, res, next) => authController.resendVerificationOtp(req, res, next)
);

// Password Reset OTP
router.post(
  '/forgot-password',
  otpLimiter,
  validateRequest(forgotPasswordSchema),
  (req, res, next) => authController.forgotPassword(req, res, next)
);

router.post(
  '/verify-reset-otp',
  otpLimiter,
  validateRequest(verifyOtpSchema),
  (req, res, next) => authController.verifyResetOtp(req, res, next)
);

router.post(
  '/reset-password',
  otpLimiter,
  validateRequest(resetPasswordSchema),
  (req, res, next) => authController.resetPassword(req, res, next)
);

// Current Authenticated User Profile
router.get(
  '/me',
  authenticateToken,
  (req, res, next) => authController.me(req, res, next)
);

// OAuth Endpoints
router.get('/google', (req, res) => authController.googleRedirect(req, res));
router.get('/google/callback', (req, res) => authController.googleCallback(req, res));

router.get('/github', (req, res) => authController.githubRedirect(req, res));
router.get('/github/callback', (req, res) => authController.githubCallback(req, res));

router.get('/linkedin', (req, res) => authController.linkedinRedirect(req, res));
router.get('/linkedin/callback', (req, res) => authController.linkedinCallback(req, res));

export default router;
