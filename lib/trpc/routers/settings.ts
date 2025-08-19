import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  privacyLevel: z.enum(["public", "friends", "private"]).optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

export const settingsRouter = router({
  // Get user settings
  get: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.userSettings.findUnique({
      where: { userId: ctx.userId },
    });

    if (!settings) {
      // Create default settings if none exist
      return await ctx.prisma.userSettings.create({
        data: {
          userId: ctx.userId,
        },
      });
    }

    return settings;
  }),

  // Update user settings
  update: protectedProcedure
    .input(settingsSchema)
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.prisma.userSettings.upsert({
        where: { userId: ctx.userId },
        update: input,
        create: {
          userId: ctx.userId,
          ...input,
        },
      });

      return settings;
    }),

  // Reset settings to defaults
  reset: protectedProcedure.mutation(async ({ ctx }) => {
    const settings = await ctx.prisma.userSettings.upsert({
      where: { userId: ctx.userId },
      update: {
        theme: "light",
        notificationsEnabled: true,
        emailNotifications: true,
        pushNotifications: true,
        privacyLevel: "friends",
        timezone: "UTC",
        language: "en",
      },
      create: {
        userId: ctx.userId,
        theme: "light",
        notificationsEnabled: true,
        emailNotifications: true,
        pushNotifications: true,
        privacyLevel: "friends",
        timezone: "UTC",
        language: "en",
      },
    });

    return settings;
  }),
}); 