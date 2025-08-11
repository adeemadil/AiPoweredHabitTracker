import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";
import { TRPCError } from "@trpc/server";
import { NotificationService } from "../../notifications";

export const notificationsRouter = router({
  // List notifications for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.notification.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),

  // Mark a notification as read
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.findUnique({
        where: { id: input.notificationId, userId: ctx.userId },
      });
      if (!notification) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found" });
      }
      return ctx.prisma.notification.update({
        where: { id: input.notificationId },
        data: { isRead: true },
      });
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: { userId: ctx.userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }),

  // Delete a single notification
  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.findUnique({
        where: { id: input.notificationId, userId: ctx.userId },
      });
      if (!notification) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found" });
      }
      await ctx.prisma.notification.delete({
        where: { id: input.notificationId },
      });
      return { success: true };
    }),

  // Delete all read notifications
  deleteAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.deleteMany({
      where: { userId: ctx.userId, isRead: true },
    });
    return { success: true };
  }),

  // Delete notifications older than X days
  deleteOld: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(365) }))
    .mutation(async ({ ctx, input }) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - input.days);
      
      await ctx.prisma.notification.deleteMany({
        where: {
          userId: ctx.userId,
          createdAt: { lt: cutoffDate },
        },
      });
      return { success: true };
    }),

  // Get unread notification count
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await NotificationService.getUnreadCount(ctx.userId);
  }),

  // Test notification endpoint
  sendTest: protectedProcedure
    .input(z.object({ 
      type: z.enum(["HABIT_REMINDER", "FRIEND_REQUEST", "REQUEST_ACCEPTED", "NEW_CHEER", "STREAK_MILESTONE", "WEEKLY_SUMMARY"]),
      message: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const message = input.message || `Test ${input.type.toLowerCase().replace('_', ' ')} notification`;
      
      return await NotificationService.createNotification({
        type: input.type,
        userId: ctx.userId,
        message: message,
      });
    }),
}); 