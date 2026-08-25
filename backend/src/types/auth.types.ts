import { User, UserStatus } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  emailVerified: boolean;
  avatar: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface OAuthUserProfile {
  provider: 'GOOGLE' | 'GITHUB' | 'LINKEDIN';
  providerUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
}
