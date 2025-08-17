import { prisma } from "./prisma";

export type NotificationType = 
  | "HABIT_REMINDER"
  | "FRIEND_REQUEST"
  | "REQUEST_ACCEPTED"
  | "NEW_CHEER"
  | "STREAK_MILESTONE"
  | "WEEKLY_SUMMARY"
  | "CHALLENGE_INVITE"
  | "CHALLENGE_JOINED"
  | "CHALLENGE_COMPLETED"
  | "CHALLENGE_MILESTONE";

export interface NotificationData {
  type: NotificationType;
  userId: string;
  message: string;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  // Create in-app notification
  static async createNotification(data: NotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          message: data.message,
          relatedEntityId: data.relatedEntityId,
        },
      });

      // Check if user has notifications enabled
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: data.userId },
      });

      if (userSettings?.notificationsEnabled) {
        // Send email notification if enabled
        if (userSettings.emailNotifications) {
          await this.sendEmailNotification(data);
        }

        // Send push notification if enabled
        if (userSettings.pushNotifications) {
          await this.sendPushNotification(data);
        }
      }

      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  }

  // Send email notification
  static async sendEmailNotification(data: NotificationData) {
    try {
      // Get user email
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true },
      });

      if (!user?.email) {
        console.error("User email not found for notification");
        return;
      }

      // For now, we'll log the email (replace with actual email service)
      console.log(`📧 Email notification to ${user.email}:`, {
        subject: this.getEmailSubject(data.type),
        message: data.message,
        type: data.type,
      });

      // TODO: Integrate with email service (SendGrid, Resend, etc.)
      // Example with SendGrid:
      // await sgMail.send({
      //   to: user.email,
      //   from: 'noreply@yourdomain.com',
      //   subject: this.getEmailSubject(data.type),
      //   text: data.message,
      //   html: this.getEmailTemplate(data),
      // });

    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }

  // Send push notification
  static async sendPushNotification(data: NotificationData) {
    try {
      // For now, we'll log the push notification
      console.log(`📱 Push notification to user ${data.userId}:`, {
        title: this.getPushTitle(data.type),
        message: data.message,
        type: data.type,
      });

      // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
      // Example with Firebase:
      // await admin.messaging().send({
      //   token: userFCMToken,
      //   notification: {
      //     title: this.getPushTitle(data.type),
      //     body: data.message,
      //   },
      //   data: {
      //     type: data.type,
      //     entityId: data.relatedEntityId || '',
      //   },
      // });

    } catch (error) {
      console.error("Failed to send push notification:", error);
    }
  }

  // Get email subject based on notification type
  static getEmailSubject(type: NotificationType): string {
    switch (type) {
      case "HABIT_REMINDER":
        return "🔔 Time to check in on your habits!";
      case "FRIEND_REQUEST":
        return "👋 New friend request on Habit Tracker";
      case "REQUEST_ACCEPTED":
        return "✅ Friend request accepted!";
      case "NEW_CHEER":
        return "🎉 Someone cheered for your habit!";
      case "STREAK_MILESTONE":
        return "🔥 Amazing! You've reached a streak milestone!";
      case "WEEKLY_SUMMARY":
        return "📊 Your weekly habit summary is ready";
      default:
        return "Notification from Habit Tracker";
    }
  }

  // Get push notification title
  static getPushTitle(type: NotificationType): string {
    switch (type) {
      case "HABIT_REMINDER":
        return "Habit Reminder";
      case "FRIEND_REQUEST":
        return "New Friend Request";
      case "REQUEST_ACCEPTED":
        return "Friend Request Accepted";
      case "NEW_CHEER":
        return "New Cheer!";
      case "STREAK_MILESTONE":
        return "Streak Milestone!";
      case "WEEKLY_SUMMARY":
        return "Weekly Summary";
      default:
        return "Habit Tracker";
    }
  }

  // Get email template (basic version)
  static getEmailTemplate(data: NotificationData): string {
    const baseTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Habit Tracker</h2>
        <p>${data.message}</p>
        <p style="color: #6b7280; font-size: 14px;">
          You can manage your notification preferences in your settings.
        </p>
      </div>
    `;
    return baseTemplate;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Get unread notification count
  static async getUnreadCount(userId: string): Promise<number> {
    const count = await prisma.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });
    return count;
  }
}
