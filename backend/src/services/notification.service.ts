import { prisma } from '../config/database';

export class NotificationService {
  /**
   * Create an in-app notification for user.
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'SYSTEM',
    link?: string
  ) {
    try {
      return await prisma.userNotification.create({
        data: {
          userId,
          title,
          message,
          type,
          link,
        },
      });
    } catch (err: any) {
      console.error('Failed to create notification:', err?.message || err);
      return null;
    }
  }

  /**
   * Get user notifications list and unread count.
   */
  async getUserNotifications(userId: string, limit = 30) {
    const notifications = await prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.userNotification.count({
      where: { userId, isRead: false },
    });

    return { notifications, unreadCount };
  }

  /**
   * Mark single notification as read.
   */
  async markAsRead(userId: string, notificationId: string) {
    return prisma.userNotification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for user.
   */
  async markAllAsRead(userId: string) {
    return prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationService = new NotificationService();
