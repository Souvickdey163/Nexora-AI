import { prisma } from '../config/database';

export class ActivityService {
  /**
   * Log user activity event.
   */
  async logActivity(
    userId: string,
    actionType: string,
    title: string,
    metadata?: any
  ) {
    try {
      return await prisma.userActivity.create({
        data: {
          userId,
          actionType,
          title,
          metadata: metadata || {},
        },
      });
    } catch (err: any) {
      console.error('Failed to log user activity:', err?.message || err);
      return null;
    }
  }

  /**
   * Get user activity feed.
   */
  async getUserActivities(userId: string, limit = 20) {
    return prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export const activityService = new ActivityService();
