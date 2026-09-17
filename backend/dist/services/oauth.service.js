"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthService = exports.OAuthService = void 0;
const env_1 = require("../config/env");
class OAuthService {
    getGoogleAuthUrl(state) {
        if (!env_1.env.GOOGLE_CLIENT_ID) {
            throw new Error('Google Client ID is not configured in environment.');
        }
        const params = new URLSearchParams({
            client_id: env_1.env.GOOGLE_CLIENT_ID,
            redirect_uri: env_1.env.GOOGLE_CALLBACK_URL,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent',
            state: state || 'google_auth',
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    async handleGoogleCallback(code) {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: env_1.env.GOOGLE_CLIENT_ID,
                client_secret: env_1.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: env_1.env.GOOGLE_CALLBACK_URL,
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok || !tokenData.access_token) {
            throw new Error(tokenData.error_description || 'Failed to obtain Google access token');
        }
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok || !userData.email) {
            throw new Error('Failed to retrieve Google user profile');
        }
        return {
            provider: 'GOOGLE',
            providerUserId: userData.id,
            email: userData.email.toLowerCase(),
            firstName: userData.given_name || userData.name || 'Google',
            lastName: userData.family_name || 'User',
            avatar: userData.picture,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
        };
    }
    getGitHubAuthUrl(state) {
        if (!env_1.env.GITHUB_CLIENT_ID) {
            throw new Error('GitHub Client ID is not configured in environment.');
        }
        const params = new URLSearchParams({
            client_id: env_1.env.GITHUB_CLIENT_ID,
            redirect_uri: env_1.env.GITHUB_CALLBACK_URL,
            scope: 'read:user user:email',
            state: state || 'github_auth',
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }
    async handleGitHubCallback(code) {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: env_1.env.GITHUB_CLIENT_ID,
                client_secret: env_1.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: env_1.env.GITHUB_CALLBACK_URL,
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok || !tokenData.access_token) {
            throw new Error(tokenData.error_description || 'Failed to obtain GitHub access token');
        }
        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `token ${tokenData.access_token}`,
                'User-Agent': 'Nexora-Backend-API',
            },
        });
        const userData = await userRes.json();
        let email = userData.email;
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${tokenData.access_token}`,
                    'User-Agent': 'Nexora-Backend-API',
                },
            });
            const emails = await emailRes.json();
            if (Array.isArray(emails)) {
                const primary = emails.find((e) => e.primary && e.verified) || emails[0];
                if (primary)
                    email = primary.email;
            }
        }
        if (!email) {
            throw new Error('Failed to retrieve GitHub email address');
        }
        const nameParts = (userData.name || userData.login || 'GitHub User').trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || 'User';
        return {
            provider: 'GITHUB',
            providerUserId: String(userData.id),
            email: email.toLowerCase(),
            firstName,
            lastName,
            avatar: userData.avatar_url,
            accessToken: tokenData.access_token,
        };
    }
    getLinkedInAuthUrl(state) {
        if (!env_1.env.LINKEDIN_CLIENT_ID) {
            throw new Error('LinkedIn Client ID is not configured in environment.');
        }
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: env_1.env.LINKEDIN_CLIENT_ID,
            redirect_uri: env_1.env.LINKEDIN_CALLBACK_URL,
            state: state || 'linkedin_auth',
            scope: 'openid profile email',
        });
        return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    }
    async handleLinkedInCallback(code) {
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: env_1.env.LINKEDIN_CLIENT_ID,
                client_secret: env_1.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri: env_1.env.LINKEDIN_CALLBACK_URL,
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenRes.ok || !tokenData.access_token) {
            throw new Error(tokenData.error_description || 'Failed to obtain LinkedIn access token');
        }
        const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();
        if (!userRes.ok || !userData.email) {
            throw new Error('Failed to retrieve LinkedIn user profile');
        }
        return {
            provider: 'LINKEDIN',
            providerUserId: userData.sub,
            email: userData.email.toLowerCase(),
            firstName: userData.given_name || 'LinkedIn',
            lastName: userData.family_name || 'User',
            avatar: userData.picture,
            accessToken: tokenData.access_token,
        };
    }
}
exports.OAuthService = OAuthService;
exports.oauthService = new OAuthService();
