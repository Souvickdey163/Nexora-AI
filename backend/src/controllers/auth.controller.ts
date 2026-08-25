import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { oauthService } from '../services/oauth.service';
import { tokenService } from '../services/token.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: result.message,
        data: { user: result.user },
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await authService.login(req.body.email, req.body.password, userAgent, ipAddress);

      // Set refreshToken in HTTP-only secure cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Sign in successful! Welcome to Nexora AI.',
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (err: any) {
      if (err.code === 'EMAIL_UNVERIFIED') {
        res.status(403).json({
          success: false,
          error: err.message,
          code: 'EMAIL_UNVERIFIED',
          data: { email: req.body.email },
        });
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await authService.verifyEmail(
        req.body.email,
        req.body.otp,
        userAgent,
        ipAddress
      );

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Email address verified successfully!',
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/resend-verification-otp
   */
  async resendVerificationOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resendVerificationOtp(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/verify-reset-otp
   */
  async verifyResetOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.verifyResetOtp(req.body.email, req.body.otp);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.resetPassword(
        req.body.email,
        req.body.otp,
        req.body.newPassword
      );
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.accessToken) {
        await tokenService.revokeSession(req.accessToken);
      }
      res.clearCookie('refreshToken');
      res.status(200).json({
        success: true,
        message: 'Successfully logged out.',
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await tokenService.refreshSession(refreshToken, userAgent, ipAddress);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: { tokens },
      });
    } catch (err: any) {
      next(err);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const user = await authService.getCurrentUser(req.user.userId);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err: any) {
      next(err);
    }
  }

  // ==========================================
  // OAUTH HANDLERS
  // ==========================================

  googleRedirect(req: Request, res: Response): void {
    try {
      const authUrl = oauthService.getGoogleAuthUrl();
      res.redirect(authUrl);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }

  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, error } = req.query;
      if (error || !code) {
        res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'Google authorization denied'))}`);
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const profile = await oauthService.handleGoogleCallback(String(code));
      const result = await authService.handleOAuthUser(profile, userAgent, ipAddress);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }

  githubRedirect(req: Request, res: Response): void {
    try {
      const authUrl = oauthService.getGitHubAuthUrl();
      res.redirect(authUrl);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }

  async githubCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, error } = req.query;
      if (error || !code) {
        res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'GitHub authorization denied'))}`);
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const profile = await oauthService.handleGitHubCallback(String(code));
      const result = await authService.handleOAuthUser(profile, userAgent, ipAddress);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }

  linkedinRedirect(req: Request, res: Response): void {
    try {
      const authUrl = oauthService.getLinkedInAuthUrl();
      res.redirect(authUrl);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }

  async linkedinCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, error } = req.query;
      if (error || !code) {
        res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'LinkedIn authorization denied'))}`);
        return;
      }

      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const profile = await oauthService.handleLinkedInCallback(String(code));
      const result = await authService.handleOAuthUser(profile, userAgent, ipAddress);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
    } catch (err: any) {
      res.redirect(`${env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
    }
  }
}

export const authController = new AuthController();
