import rateLimit from 'express-rate-limit';

// General Auth API rate limiter (max 30 requests per 15 mins)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
  },
});

// Strict Rate Limiter for OTP sending/verifying (max 5 requests per 10 mins)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many OTP requests. Please wait a few minutes before trying again.',
  },
});

// Strict Rate Limiter for Login (max 10 failed login attempts per 15 mins)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. Account temporarily locked for protection.',
  },
});
