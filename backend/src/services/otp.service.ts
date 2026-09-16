import { prisma } from '../config/database';
import { generateOtpCode, hashOtp, verifyOtpHash } from '../utils/otp';
import { emailService } from './email.service';
import { OtpType } from '@prisma/client';

export class OtpService {
  private static OTP_EXPIRATION_MINUTES = 10;
  private static RESEND_COOLDOWN_SECONDS = 60;
  private static MAX_ATTEMPTS = 5;

  /**
   * Creates, hashes, stores, and emails an OTP code.
   */
  async sendOtp(
    email: string,
    type: OtpType,
    userId?: string,
    options: { ignoreCooldown?: boolean } = {}
  ): Promise<{ success: boolean; message: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Check rate limit/cooldown
    const lastOtp = await prisma.otpVerification.findFirst({
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

    // Generate plain code and hash
    const plainOtp = generateOtpCode();
    const otpHash = hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OtpService.OTP_EXPIRATION_MINUTES * 60 * 1000);

    // Save hashed OTP in database
    await prisma.otpVerification.create({
      data: {
        email: normalizedEmail,
        otpHash,
        type,
        expiresAt,
        maxAttempts: OtpService.MAX_ATTEMPTS,
        userId,
      },
    });

    // Send real email via emailService
    const emailSent = await emailService.sendOtpEmail(normalizedEmail, plainOtp, type);

    if (!emailSent) {
      throw new Error('Failed to deliver OTP email. Please check your email address.');
    }

    return {
      success: true,
      message: `OTP verification code sent to ${normalizedEmail}. Code expires in ${OtpService.OTP_EXPIRATION_MINUTES} minutes.`,
    };
  }

  /**
   * Verifies an OTP code provided by the user.
   */
  async verifyOtp(email: string, plainOtp: string, type: OtpType): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await prisma.otpVerification.findFirst({
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
      // If already verified for password reset / registration in current window, check validity
      if (otpRecord.expiresAt >= new Date() && verifyOtpHash(plainOtp, otpRecord.otpHash)) {
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

    // Increment attempts counter
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    // Hash check
    const isValid = verifyOtpHash(plainOtp, otpRecord.otpHash);

    if (!isValid) {
      const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1);
      if (remainingAttempts <= 0) {
        throw new Error('Invalid OTP code. Maximum attempts reached. Please request a new code.');
      }
      throw new Error(`Invalid OTP code. ${remainingAttempts} attempts remaining.`);
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    return true;
  }
}

export const otpService = new OtpService();
