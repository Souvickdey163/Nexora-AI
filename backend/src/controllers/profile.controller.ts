import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { profileService } from '../services/profile.service';

export class ProfileController {
  /**
   * GET /api/profile
   */
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const profile = await profileService.getProfile(req.user.userId);
      res.status(200).json({
        success: true,
        data: { user: profile },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const updatedUser = await profileService.updateProfile(req.user.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully!',
        data: { user: updatedUser },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/profile/avatar
   */
  async uploadAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, error: 'No avatar image file uploaded.' });
        return;
      }

      const result = await profileService.uploadAvatar(
        req.user.userId,
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );

      res.status(200).json({
        success: true,
        message: 'Profile photo updated successfully!',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/profile/avatar/:filename
   */
  async streamAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { filename } = req.params;
      const fileBuffer = await profileService.getAvatarFile(filename);

      const ext = filename.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(fileBuffer);
    } catch (err) {
      res.status(404).send('Avatar image not found');
    }
  }
}

export const profileController = new ProfileController();
