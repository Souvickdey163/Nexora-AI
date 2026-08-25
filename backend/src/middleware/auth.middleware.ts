import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service';
import { JwtPayload } from '../types/auth.types';
import { UserStatus } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  accessToken?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is missing or malformed',
      });
      return;
    }

    const payload = tokenService.verifyAccessToken(token);

    if (payload.status === UserStatus.SUSPENDED || payload.status === UserStatus.DEACTIVATED) {
      res.status(403).json({
        success: false,
        error: 'Account access has been restricted',
      });
      return;
    }

    req.user = payload;
    req.accessToken = token;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired access token',
    });
  }
};
