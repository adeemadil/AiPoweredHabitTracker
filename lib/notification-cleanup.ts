import { prisma } from "./prisma";

export class NotificationCleanupService {
  // Delete notifications older than specified days
  static async cleanupOldNotifications(daysOld: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
        },
      });
      
      console.log(`🧹 Cleaned up ${result.count} notifications older than ${daysOld} days`);
      return result.count;
    } catch (error) {
      console.error("Failed to cleanup old notifications:", error);
      throw error;
    }
  }

  // Delete read notifications older than specified days
  static async cleanupOldReadNotifications(daysOld: number = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const result = await prisma.notification.deleteMany({
        where: {
          isRead: true,
          createdAt: { lt: cutoffDate },
        },
      });
      
      console.log(`🧹 Cleaned up ${result.count} read notifications older than ${daysOld} days`);
      return result.count;
    } catch (error) {
      console.error("Failed to cleanup old read notifications:", error);
      throw error;
    }
  }

  // Delete all read notifications
  static async cleanupAllReadNotifications() {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          isRead: true,
        },
      });
      
      console.log(`🧹 Cleaned up ${result.count} read notifications`);
      return result.count;
    } catch (error) {
      console.error("Failed to cleanup read notifications:", error);
      throw error;
    }
  }

  // Get notification statistics
  static async getNotificationStats() {
    try {
      const [total, unread, read, old] = await Promise.all([
        prisma.notification.count(),
        prisma.notification.count({ where: { isRead: false } }),
        prisma.notification.count({ where: { isRead: true } }),
        prisma.notification.count({
          where: {
            createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days
          },
        }),
      ]);
      
      return {
        total,
        unread,
        read,
        old,
      };
    } catch (error) {
      console.error("Failed to get notification stats:", error);
      throw error;
    }
  }
}
