"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required').max(50),
    lastName: zod_1.z.string().min(1, 'Last name is required').max(50),
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    otp: zod_1.z.string().length(6, 'OTP verification code must be exactly 6 digits'),
});
exports.resendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    otp: zod_1.z.string().length(6, 'OTP verification code must be exactly 6 digits'),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(100)
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
});
