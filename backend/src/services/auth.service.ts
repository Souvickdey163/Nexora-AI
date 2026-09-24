import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { tokenService } from './token.service';
import { otpService } from './otp.service';
import { UserStatus, OtpType, OAuthProvider } from '@prisma/client';
import { UserResponse, OAuthUserProfile } from '../types/auth.types';
import { creditService } from './credit.service';

export class AuthService {
  /**
   * Format user entity to public UserResponse object.
   */
  private formatUser(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name || `${user.firstName} ${user.lastName}`.trim(),
      emailVerified: user.emailVerified,
      avatar: user.avatar,
      avatarUrl: user.avatar,
      credits: user.credits ?? 10,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Register a new user with Email + Password.
   */
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (existingUser.emailVerified) {
        throw new Error('An account with this email address already exists. Please sign in.');
      } else {
        // Unverified user registered again: update password and resend OTP
        const passwordHash = await hashPassword(data.password);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName} ${data.lastName}`.trim(),
            passwordHash,
          },
        });
        await otpService.sendOtp(normalizedEmail, OtpType.REGISTRATION, existingUser.id, { ignoreCooldown: true });
        return {
          user: this.formatUser(existingUser),
          message: 'Account updated. Verification OTP code has been sent to your email.',
        };
      }
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create new unverified user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        status: UserStatus.UNVERIFIED,
        emailVerified: false,
        profile: {
          create: {},
        },
      },
    });

    // Grant initial welcome bonus credits (10 credits exactly once)
    await creditService.grantWelcomeBonus(newUser.id);

    // Generate & send registration OTP
    await otpService.sendOtp(normalizedEmail, OtpType.REGISTRATION, newUser.id);

    return {
      user: this.formatUser(newUser),
      message: 'Registration successful! Verification OTP code has been sent to your email.',
    };
  }

  /**
   * Verify email OTP code and activate account.
   */
  async verifyEmail(email: string, otpCode: string, userAgent?: string, ipAddress?: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP
    await otpService.verifyOtp(normalizedEmail, otpCode, OtpType.REGISTRATION);

    // Update user status
    const user = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
      },
    });

    // Issue JWT access token & session
    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      status: user.status,
    });

    const tokens = await tokenService.createSession(user.id, accessToken, userAgent, ipAddress);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  /**
   * Resend email verification OTP.
   */
  async resendVerificationOtp(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    if (user.emailVerified) {
      throw new Error('This email address is already verified. Please sign in.');
    }

    return otpService.sendOtp(normalizedEmail, OtpType.REGISTRATION, user.id);
  }

  /**
   * Login with Email + Password.
   */
  async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      const err: any = new Error('Invalid email or password credentials.');
      err.statusCode = 400;
      throw err;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const err: any = new Error('Invalid email or password credentials.');
      err.statusCode = 400;
      throw err;
    }

    // Check email verification status
    if (!user.emailVerified || user.status === UserStatus.UNVERIFIED) {
      // Trigger new OTP and instruct user to verify
      await otpService.sendOtp(normalizedEmail, OtpType.REGISTRATION, user.id, { ignoreCooldown: true });
      const error: any = new Error('Your email address is not verified yet. A new verification OTP code has been sent to your inbox.');
      error.code = 'EMAIL_UNVERIFIED';
      throw error;
    }

    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DEACTIVATED) {
      throw new Error('Your account has been suspended or deactivated. Please contact support.');
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Issue JWT & session
    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      status: user.status,
    });

    const tokens = await tokenService.createSession(user.id, accessToken, userAgent, ipAddress);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  /**
   * Trigger forgot password reset OTP.
   */
  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return success to avoid email enumeration attack
      return {
        success: true,
        message: `If an account exists for ${normalizedEmail}, a password reset OTP code has been sent.`,
      };
    }

    return otpService.sendOtp(normalizedEmail, OtpType.PASSWORD_RESET, user.id);
  }

  /**
   * Verify password reset OTP code.
   */
  async verifyResetOtp(email: string, otpCode: string) {
    const normalizedEmail = email.toLowerCase().trim();
    await otpService.verifyOtp(normalizedEmail, otpCode, OtpType.PASSWORD_RESET);
    return {
      success: true,
      message: 'Reset OTP code verified successfully. You may now set a new password.',
    };
  }

  /**
   * Reset user password after OTP verification.
   */
  async resetPassword(email: string, otpCode: string, newPassword: string) {
    const normalizedEmail = email.toLowerCase().trim();

    // Re-verify OTP code
    await otpService.verifyOtp(normalizedEmail, otpCode, OtpType.PASSWORD_RESET);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return {
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.',
    };
  }

  /**
   * Process OAuth user profile (Google, GitHub, LinkedIn).
   */
  async handleOAuthUser(profile: OAuthUserProfile, userAgent?: string, ipAddress?: string) {
    const email = profile.email.toLowerCase().trim();
    const providerEnum = profile.provider as OAuthProvider;

    // Check if OAuth account exists
    const oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: providerEnum,
          providerUserId: profile.providerUserId,
        },
      },
      include: { user: true },
    });

    let user: any = oauthAccount ? oauthAccount.user : null;

    if (!user) {
      // Check if user exists with matching email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user for OAuth
        user = await prisma.user.create({
          data: {
            email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            name: `${profile.firstName} ${profile.lastName}`.trim(),
            avatar: profile.avatar,
            emailVerified: true,
            status: UserStatus.ACTIVE,
            lastLoginAt: new Date(),
            profile: {
              create: {
                githubUrl: profile.provider === 'GITHUB' ? `https://github.com/${profile.firstName}` : undefined,
              },
            },
          },
        });
      } else {
        // Mark user email verified and active if connecting via trusted OAuth
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: true,
            status: UserStatus.ACTIVE,
            avatar: user.avatar || profile.avatar,
            lastLoginAt: new Date(),
          },
        });
      }

      // Link OAuth account
      await prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: providerEnum,
          providerUserId: profile.providerUserId,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        },
      });
    } else {
      // Update last login and avatar
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatar: user.avatar || profile.avatar,
        },
      });

      // Update access token
      await prisma.oAuthAccount.update({
        where: { id: oauthAccount!.id },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken || oauthAccount!.refreshToken,
        },
      });
    }

    // Ensure welcome bonus exists exactly once
    await creditService.ensureWelcomeBonus(user.id);

    // Fetch updated user to get accurate credits and avatar
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Generate JWT access token & session
    const accessToken = tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      status: user.status,
    });

    const tokens = await tokenService.createSession(user.id, accessToken, userAgent, ipAddress);

    return {
      user: this.formatUser(updatedUser || user),
      tokens,
    };
  }

  /**
   * Get user profile by ID.
   */
  async getCurrentUser(userId: string) {
    await creditService.ensureWelcomeBonus(userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        oauthAccounts: {
          select: { provider: true, createdAt: true },
        },
      },
    });

    if (!user) {
      throw new Error('User account not found.');
    }

    return {
      ...this.formatUser(user),
      profile: user.profile,
      connectedAccounts: user.oauthAccounts.map((acc) => acc.provider),
    };
  }
}

export const authService = new AuthService();
