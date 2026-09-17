"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpService = exports.OtpService = void 0;
const database_1 = require("../config/database");
const otp_1 = require("../utils/otp");
const email_service_1 = require("./email.service");
class OtpService {
    static OTP_EXPIRATION_MINUTES = 10;
    static RESEND_COOLDOWN_SECONDS = 60;
    static MAX_ATTEMPTS = 5;
    async sendOtp(email, type, userId, options = {}) {
        const normalizedEmail = email.toLowerCase().trim();
        const lastOtp = await database_1.prisma.otpVerification.findFirst({
            where: { email: normalizedEmail, type },
            orderBy: { createdAt: 'desc' },
        });
        if (lastOtp && !options.ignoreCooldown) {
            const timeSinceLastOtp = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
            if (timeSinceLastOtp < OtpService.RESEND_COOLDOWN_SECONDS) {
                const secondsRemaining = Math.ceil(OtpService.RESEND_COOLDOWN_SECONDS - timeSinceLastOtp);
                throw new Error(`Please wait ${secondsRemaining} seconds before requesting a new OTP.`);
            }
        }
        const plainOtp = (0, otp_1.generateOtpCode)();
        const otpHash = (0, otp_1.hashOtp)(plainOtp);
        const expiresAt = new Date(Date.now() + OtpService.OTP_EXPIRATION_MINUTES * 60 * 1000);
        await database_1.prisma.otpVerification.create({
            data: {
                email: normalizedEmail,
                otpHash,
                type,
                expiresAt,
                maxAttempts: OtpService.MAX_ATTEMPTS,
                userId,
            },
        });
        const emailSent = await email_service_1.emailService.sendOtpEmail(normalizedEmail, plainOtp, type);
        if (!emailSent) {
            throw new Error('Failed to deliver OTP email. Please check your email address.');
        }
        return {
            success: true,
            message: `OTP verification code sent to ${normalizedEmail}. Code expires in ${OtpService.OTP_EXPIRATION_MINUTES} minutes.`,
        };
    }
    async verifyOtp(email, plainOtp, type) {
        const normalizedEmail = email.toLowerCase().trim();
        const otpRecord = await database_1.prisma.otpVerification.findFirst({
            where: {
                email: normalizedEmail,
                type,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otpRecord) {
            throw new Error('No active OTP code found for this email.');
        }
        if (otpRecord.verified) {
            if (otpRecord.expiresAt >= new Date() && (0, otp_1.verifyOtpHash)(plainOtp, otpRecord.otpHash)) {
                return true;
            }
            throw new Error('This OTP code has already been used or expired.');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new Error('OTP code has expired. Please request a new code.');
        }
        if (otpRecord.attempts >= otpRecord.maxAttempts) {
            throw new Error('Maximum OTP verification attempts exceeded. Please request a new code.');
        }
        await database_1.prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
        });
        const isValid = (0, otp_1.verifyOtpHash)(plainOtp, otpRecord.otpHash);
        if (!isValid) {
            const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1);
            if (remainingAttempts <= 0) {
                throw new Error('Invalid OTP code. Maximum attempts reached. Please request a new code.');
            }
            throw new Error(`Invalid OTP code. ${remainingAttempts} attempts remaining.`);
        }
        await database_1.prisma.otpVerification.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });
        return true;
    }
}
exports.OtpService = OtpService;
exports.otpService = new OtpService();
