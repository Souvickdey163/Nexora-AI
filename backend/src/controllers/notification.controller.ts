import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { notificationService } from '../services/notification.service';

export class NotificationController {
  async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const data = await notificationService.getUserNotifications(req.user.userId);
      return res.status(200).json({
        success: true,
        notifications: data.notifications,
        unreadCount: data.unreadCount,
      });
    } catch (err) {
      return next(err);
    }
  }

  async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      const { id } = req.params;
      await notificationService.markAsRead(req.user.userId, id);
      return res.status(200).json({ success: true, message: 'Notification marked as read.' });
    } catch (err) {
      return next(err);
    }
  }

  async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
      await notificationService.markAllAsRead(req.user.userId);
      return res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (err) {
      return next(err);
    }
  }
}

export const notificationController = new NotificationController();
