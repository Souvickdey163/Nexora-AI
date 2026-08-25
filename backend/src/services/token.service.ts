import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { JwtPayload, AuthTokens } from '../types/auth.types';
import { UserStatus } from '@prisma/client';

class TokenService {
  /**
   * Signs a JWT access token for a given user.
   */
  generateAccessToken(payload: { userId: string; email: string; status: UserStatus }): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  /**
   * Generates a secure random opaque refresh token.
   */
  generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Verifies a JWT access token.
   */
  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }

  /**
   * Creates and persists a session record in the database.
   */
  async createSession(
    userId: string,
    accessToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days session validity

    await prisma.session.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  /**
   * Rotates tokens given a valid refresh token.
   */
  async refreshSession(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const existingSession = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!existingSession || existingSession.isRevoked || existingSession.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Revoke old session
    await prisma.session.update({
      where: { id: existingSession.id },
      data: { isRevoked: true },
    });

    // Issue new access & refresh tokens
    const newAccessToken = this.generateAccessToken({
      userId: existingSession.user.id,
      email: existingSession.user.email,
      status: existingSession.user.status,
    });

    return this.createSession(existingSession.user.id, newAccessToken, userAgent, ipAddress);
  }

  /**
   * Revokes a session upon logout.
   */
  async revokeSession(accessToken: string): Promise<void> {
    await prisma.session.updateMany({
      where: { token: accessToken },
      data: { isRevoked: true },
    });
  }
}

export const tokenService = new TokenService();
