"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
class EmailService {
    transporter = null;
    constructor() {
        this.initTransporter();
    }
    async initTransporter() {
        const isConfigured = Boolean(env_1.env.SMTP_USER && env_1.env.SMTP_PASSWORD);
        logger_1.logger.info(`[SMTP DIAGNOSTIC] SMTP configured: ${isConfigured}`);
        if (isConfigured) {
            this.transporter = nodemailer_1.default.createTransport({
                host: env_1.env.SMTP_HOST,
                port: env_1.env.SMTP_PORT,
                secure: env_1.env.SMTP_PORT === 465,
                auth: {
                    user: env_1.env.SMTP_USER,
                    pass: env_1.env.SMTP_PASSWORD,
                },
            });
            logger_1.logger.info('📧 Nodemailer SMTP transporter initialized.');
            try {
                await this.transporter.verify();
                logger_1.logger.info('[SMTP DIAGNOSTIC] SMTP connection: success');
                logger_1.logger.info('[SMTP DIAGNOSTIC] SMTP authentication: success');
            }
            catch (err) {
                logger_1.logger.error(`[SMTP DIAGNOSTIC] SMTP connection/authentication failure: ${err.message || err}`);
            }
        }
        else {
            logger_1.logger.warn('⚠️ SMTP credentials missing in environment. Email service in simulation mode.');
        }
    }
    async sendOtpEmail(email, otpCode, type) {
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
            logger_1.logger.info('[SMTP DIAGNOSTIC] sendMail called: yes');
            try {
                const info = await this.transporter.sendMail({
                    from: env_1.env.SMTP_FROM,
                    to: email,
                    subject,
                    html: htmlContent,
                });
                const isAccepted = Boolean(info.accepted && info.accepted.length > 0);
                const hasMessageId = Boolean(info.messageId);
                logger_1.logger.info(`[SMTP DIAGNOSTIC] email accepted by SMTP server: ${isAccepted ? 'yes' : 'no'}`);
                logger_1.logger.info(`[SMTP DIAGNOSTIC] message ID returned: ${hasMessageId ? 'yes' : 'no'}`);
                logger_1.logger.info(`📧 Real OTP Email successfully delivered via SMTP server to recipient.`);
                return true;
            }
            catch (err) {
                logger_1.logger.error(`[SMTP DIAGNOSTIC] email accepted by SMTP server: no`);
                logger_1.logger.error(`[SMTP DIAGNOSTIC] message ID returned: no`);
                logger_1.logger.error(`❌ Failed to send SMTP email to recipient: ${err.message || err}`);
                return false;
            }
        }
        else {
            logger_1.logger.info('[SMTP DIAGNOSTIC] sendMail called: no (Simulation Mode)');
            logger_1.logger.info(`📧 [EMAIL SIMULATION MODE] Real OTP email dispatch skipped because SMTP credentials are missing.`);
            return true;
        }
    }
}
exports.emailService = new EmailService();
