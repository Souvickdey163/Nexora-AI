import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    if (env.SMTP_USER && env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });
      logger.info('📧 Nodemailer SMTP transporter initialized.');
    } else {
      logger.warn('⚠️ SMTP credentials missing in environment. Email service in simulation mode.');
    }
  }

  /**
   * Sends an OTP verification email to the target recipient.
   */
  async sendOtpEmail(email: string, otpCode: string, type: 'REGISTRATION' | 'PASSWORD_RESET'): Promise<boolean> {
    const isReset = type === 'PASSWORD_RESET';
    const subject = isReset
      ? 'Nexora AI - Reset Your Password'
      : 'Nexora AI - Verify Your Email Code';

    const actionText = isReset
      ? 'Use the code below to reset your Nexora AI password.'
      : 'Thank you for joining Nexora AI. Use the code below to verify your email address.';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; text-align: center; shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .logo { font-size: 26px; font-weight: 800; color: #38bdf8; letter-spacing: -0.5px; margin-bottom: 24px; text-decoration: none; display: inline-block; }
    .title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .text { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
    .otp-box { background: #090d16; border: 2px dashed #0284c7; border-radius: 12px; padding: 18px 24px; display: inline-block; margin-bottom: 28px; }
    .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: 'Courier New', monospace; }
    .footer { font-size: 12px; color: #64748b; margin-top: 32px; border-top: 1px solid #334155; padding-top: 20px; }
    .warning { color: #f43f5e; font-size: 12px; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">⚡ NEXORA AI</div>
    <div class="title">${isReset ? 'Password Reset Code' : 'Email Verification Code'}</div>
    <div class="text">${actionText}</div>
    <div class="otp-box">
      <div class="otp-code">${otpCode}</div>
    </div>
    <div class="text">This verification code is valid for <strong>10 minutes</strong>.</div>
    <div class="warning">If you did not request this code, please ignore this email or contact support.</div>
    <div class="footer">
      &copy; 2026 Nexora AI Platform. All rights reserved.<br>
      Empowering the next generation of AI-driven career and placement intelligence.
    </div>
  </div>
</body>
</html>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: email,
          subject,
          html: htmlContent,
        });
        logger.info(`📧 Real OTP Email successfully delivered to: ${email}`);
        return true;
      } catch (err: any) {
        logger.error(`❌ Failed to send SMTP email to ${email}: ${err.message || err}`);
        return false;
      }
    } else {
      // In development mode without active SMTP credentials, log simulated delivery
      logger.info(`📧 [EMAIL SIMULATION MODE] OTP Code for ${email}: ${otpCode}`);
      return true;
    }
  }
}

export const emailService = new EmailService();
