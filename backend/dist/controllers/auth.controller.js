"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const oauth_service_1 = require("../services/oauth.service");
const token_service_1 = require("../services/token.service");
const env_1 = require("../config/env");
class AuthController {
    async register(req, res, next) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            res.status(201).json({
                success: true,
                message: result.message,
                data: { user: result.user },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async login(req, res, next) {
        try {
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const result = await auth_service_1.authService.login(req.body.email, req.body.password, userAgent, ipAddress);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
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
        }
        catch (err) {
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
    async verifyEmail(req, res, next) {
        try {
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const result = await auth_service_1.authService.verifyEmail(req.body.email, req.body.otp, userAgent, ipAddress);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
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
        }
        catch (err) {
            next(err);
        }
    }
    async resendVerificationOtp(req, res, next) {
        try {
            const result = await auth_service_1.authService.resendVerificationOtp(req.body.email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async forgotPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.forgotPassword(req.body.email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async verifyResetOtp(req, res, next) {
        try {
            const result = await auth_service_1.authService.verifyResetOtp(req.body.email, req.body.otp);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const result = await auth_service_1.authService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (err) {
            next(err);
        }
    }
    async logout(req, res, next) {
        try {
            if (req.accessToken) {
                await token_service_1.tokenService.revokeSession(req.accessToken);
            }
            res.clearCookie('refreshToken');
            res.status(200).json({
                success: true,
                message: 'Successfully logged out.',
            });
        }
        catch (err) {
            next(err);
        }
    }
    async refresh(req, res, next) {
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
            const tokens = await token_service_1.tokenService.refreshSession(refreshToken, userAgent, ipAddress);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
                data: { tokens },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async me(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }
            const user = await auth_service_1.authService.getCurrentUser(req.user.userId);
            res.status(200).json({
                success: true,
                data: { user },
            });
        }
        catch (err) {
            next(err);
        }
    }
    googleRedirect(req, res) {
        try {
            const authUrl = oauth_service_1.oauthService.getGoogleAuthUrl();
            res.redirect(authUrl);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
    async googleCallback(req, res) {
        try {
            const { code, error } = req.query;
            if (error || !code) {
                res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'Google authorization denied'))}`);
                return;
            }
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const profile = await oauth_service_1.oauthService.handleGoogleCallback(String(code));
            const result = await auth_service_1.authService.handleOAuthUser(profile, userAgent, ipAddress);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`${env_1.env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
    githubRedirect(req, res) {
        try {
            const authUrl = oauth_service_1.oauthService.getGitHubAuthUrl();
            res.redirect(authUrl);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
    async githubCallback(req, res) {
        try {
            const { code, error } = req.query;
            if (error || !code) {
                res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'GitHub authorization denied'))}`);
                return;
            }
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const profile = await oauth_service_1.oauthService.handleGitHubCallback(String(code));
            const result = await auth_service_1.authService.handleOAuthUser(profile, userAgent, ipAddress);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`${env_1.env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
    linkedinRedirect(req, res) {
        try {
            const authUrl = oauth_service_1.oauthService.getLinkedInAuthUrl();
            res.redirect(authUrl);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
    async linkedinCallback(req, res) {
        try {
            const { code, error } = req.query;
            if (error || !code) {
                res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(String(error || 'LinkedIn authorization denied'))}`);
                return;
            }
            const userAgent = req.headers['user-agent'];
            const ipAddress = req.ip || req.socket.remoteAddress;
            const profile = await oauth_service_1.oauthService.handleLinkedInCallback(String(code));
            const result = await auth_service_1.authService.handleOAuthUser(profile, userAgent, ipAddress);
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            res.redirect(`${env_1.env.CLIENT_URL}/auth/callback?token=${encodeURIComponent(result.tokens.accessToken)}`);
        }
        catch (err) {
            res.redirect(`${env_1.env.CLIENT_URL}/auth?error=${encodeURIComponent(err.message)}`);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
