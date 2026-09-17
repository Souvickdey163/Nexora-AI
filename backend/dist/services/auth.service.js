"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
const token_service_1 = require("./token.service");
const otp_service_1 = require("./otp.service");
const client_1 = require("@prisma/client");
class AuthService {
    formatUser(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name || `${user.firstName} ${user.lastName}`.trim(),
            emailVerified: user.emailVerified,
            avatar: user.avatar,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async register(data) {
        const normalizedEmail = data.email.toLowerCase().trim();
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            if (existingUser.emailVerified) {
                throw new Error('An account with this email address already exists. Please sign in.');
            }
            else {
                const passwordHash = await (0, password_1.hashPassword)(data.password);
                await database_1.prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        name: `${data.firstName} ${data.lastName}`.trim(),
                        passwordHash,
                    },
                });
                await otp_service_1.otpService.sendOtp(normalizedEmail, client_1.OtpType.REGISTRATION, existingUser.id, { ignoreCooldown: true });
                return {
                    user: this.formatUser(existingUser),
                    message: 'Account updated. Verification OTP code has been sent to your email.',
                };
            }
        }
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        const newUser = await database_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                name: `${data.firstName} ${data.lastName}`.trim(),
                status: client_1.UserStatus.UNVERIFIED,
                emailVerified: false,
                profile: {
                    create: {},
                },
            },
        });
        await otp_service_1.otpService.sendOtp(normalizedEmail, client_1.OtpType.REGISTRATION, newUser.id);
        return {
            user: this.formatUser(newUser),
            message: 'Registration successful! Verification OTP code has been sent to your email.',
        };
    }
    async verifyEmail(email, otpCode, userAgent, ipAddress) {
        const normalizedEmail = email.toLowerCase().trim();
        await otp_service_1.otpService.verifyOtp(normalizedEmail, otpCode, client_1.OtpType.REGISTRATION);
        const user = await database_1.prisma.user.update({
            where: { email: normalizedEmail },
            data: {
                emailVerified: true,
                status: client_1.UserStatus.ACTIVE,
                lastLoginAt: new Date(),
            },
        });
        const accessToken = token_service_1.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
            status: user.status,
        });
        const tokens = await token_service_1.tokenService.createSession(user.id, accessToken, userAgent, ipAddress);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async resendVerificationOtp(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await database_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new Error('No account found with this email address.');
        }
        if (user.emailVerified) {
            throw new Error('This email address is already verified. Please sign in.');
        }
        return otp_service_1.otpService.sendOtp(normalizedEmail, client_1.OtpType.REGISTRATION, user.id);
    }
    async login(email, password, userAgent, ipAddress) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await database_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user || !user.passwordHash) {
            const err = new Error('Invalid email or password credentials.');
            err.statusCode = 400;
            throw err;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isPasswordValid) {
            const err = new Error('Invalid email or password credentials.');
            err.statusCode = 400;
            throw err;
        }
        if (!user.emailVerified || user.status === client_1.UserStatus.UNVERIFIED) {
            await otp_service_1.otpService.sendOtp(normalizedEmail, client_1.OtpType.REGISTRATION, user.id, { ignoreCooldown: true });
            const error = new Error('Your email address is not verified yet. A new verification OTP code has been sent to your inbox.');
            error.code = 'EMAIL_UNVERIFIED';
            throw error;
        }
        if (user.status === client_1.UserStatus.SUSPENDED || user.status === client_1.UserStatus.DEACTIVATED) {
            throw new Error('Your account has been suspended or deactivated. Please contact support.');
        }
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const accessToken = token_service_1.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
            status: user.status,
        });
        const tokens = await token_service_1.tokenService.createSession(user.id, accessToken, userAgent, ipAddress);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async forgotPassword(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await database_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return {
                success: true,
                message: `If an account exists for ${normalizedEmail}, a password reset OTP code has been sent.`,
            };
        }
        return otp_service_1.otpService.sendOtp(normalizedEmail, client_1.OtpType.PASSWORD_RESET, user.id);
    }
    async verifyResetOtp(email, otpCode) {
        const normalizedEmail = email.toLowerCase().trim();
        await otp_service_1.otpService.verifyOtp(normalizedEmail, otpCode, client_1.OtpType.PASSWORD_RESET);
        return {
            success: true,
            message: 'Reset OTP code verified successfully. You may now set a new password.',
        };
    }
    async resetPassword(email, otpCode, newPassword) {
        const normalizedEmail = email.toLowerCase().trim();
        await otp_service_1.otpService.verifyOtp(normalizedEmail, otpCode, client_1.OtpType.PASSWORD_RESET);
        const user = await database_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new Error('User not found.');
        }
        const newPasswordHash = await (0, password_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash },
        });
        return {
            success: true,
            message: 'Password reset successful! You can now sign in with your new password.',
        };
    }
    async handleOAuthUser(profile, userAgent, ipAddress) {
        const email = profile.email.toLowerCase().trim();
        const providerEnum = profile.provider;
        const oauthAccount = await database_1.prisma.oAuthAccount.findUnique({
            where: {
                provider_providerUserId: {
                    provider: providerEnum,
                    providerUserId: profile.providerUserId,
                },
            },
            include: { user: true },
        });
        let user = oauthAccount ? oauthAccount.user : null;
        if (!user) {
            user = await database_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                user = await database_1.prisma.user.create({
                    data: {
                        email,
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        name: `${profile.firstName} ${profile.lastName}`.trim(),
                        avatar: profile.avatar,
                        emailVerified: true,
                        status: client_1.UserStatus.ACTIVE,
                        lastLoginAt: new Date(),
                        profile: {
                            create: {
                                githubUrl: profile.provider === 'GITHUB' ? `https://github.com/${profile.firstName}` : undefined,
                            },
                        },
                    },
                });
            }
            else {
                user = await database_1.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        emailVerified: true,
                        status: client_1.UserStatus.ACTIVE,
                        avatar: user.avatar || profile.avatar,
                        lastLoginAt: new Date(),
                    },
                });
            }
            await database_1.prisma.oAuthAccount.create({
                data: {
                    userId: user.id,
                    provider: providerEnum,
                    providerUserId: profile.providerUserId,
                    accessToken: profile.accessToken,
                    refreshToken: profile.refreshToken,
                },
            });
        }
        else {
            user = await database_1.prisma.user.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                    avatar: user.avatar || profile.avatar,
                },
            });
            await database_1.prisma.oAuthAccount.update({
                where: { id: oauthAccount.id },
                data: {
                    accessToken: profile.accessToken,
                    refreshToken: profile.refreshToken || oauthAccount.refreshToken,
                },
            });
        }
        const accessToken = token_service_1.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
            status: user.status,
        });
        const tokens = await token_service_1.tokenService.createSession(user.id, accessToken, userAgent, ipAddress);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async getCurrentUser(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user) {
            throw new Error('User account not found.');
        }
        return {
            ...this.formatUser(user),
            profile: user.profile,
        };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
