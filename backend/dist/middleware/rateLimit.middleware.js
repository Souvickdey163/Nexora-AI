"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = exports.otpLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: isTestEnv ? 1000 : 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
    },
});
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: isTestEnv ? 1000 : 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many OTP requests. Please wait a few minutes before trying again.',
    },
});
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: isTestEnv ? 1000 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many login attempts. Account temporarily locked for protection.',
    },
});
