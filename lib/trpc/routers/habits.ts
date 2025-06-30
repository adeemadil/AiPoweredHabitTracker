import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";
import { TRPCError } from "@trpc/server";

export const habitsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Ensure user exists in database
    await ensureUserExists(ctx.userId, ctx.prisma);

    const habits = await ctx.prisma.habit.findMany({
      where: { userId: ctx.userId },
      include: {
        completions: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    return habits.map((habit: any) => ({
      ...habit,
      streak: calculateStreak(habit.completions),
      lastCompleted: habit.completions[0]?.date || null,
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        emoji: z.string().optional(),
        frequency: z.enum(["daily", "weekly"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure user exists in database
      await ensureUserExists(ctx.userId, ctx.prisma);

      // Trim whitespace from name
      const trimmedName = input.name.trim();

      // Check for duplicate habit name (case-insensitive, trimmed)
      const existing = await ctx.prisma.habit.findFirst({
        where: {
          userId: ctx.userId,
          name: { equals: trimmedName, mode: "insensitive" },
        },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a habit with this name.",
        });
      }

      return ctx.prisma.habit.create({
        data: {
          ...input,
          name: trimmedName,
          userId: ctx.userId,
        },
      });
    }),

  complete: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const habit = await ctx.prisma.habit.findUnique({
        where: { id: input.habitId },
      });

      if (!habit || habit.userId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return ctx.prisma.habitCompletion.create({
        data: {
          habitId: input.habitId,
          date: today,
        },
      });
    }),

  // Send a cheer for a habit
  sendCheer: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        receiverId: z.string(),
        message: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure the habit exists and belongs to the receiver
      const habit = await ctx.prisma.habit.findUnique({
        where: { id: input.habitId, userId: input.receiverId },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found or does not belong to the receiver.",
        });
      }

      // Ensure sender and receiver are friends
      const friendship = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              userId: ctx.userId,
              friendId: input.receiverId,
              status: "accepted",
            },
            {
              userId: input.receiverId,
              friendId: ctx.userId,
              status: "accepted",
            },
          ],
        },
      });

      if (!friendship) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only send cheers to friends.",
        });
      }

      if (ctx.userId === input.receiverId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot send a cheer to yourself.",
        });
      }

      return ctx.prisma.cheer.create({
        data: {
          senderId: ctx.userId,
          receiverId: input.receiverId,
          habitId: input.habitId,
          message: input.message,
        },
      });
    }),

  // List cheers for a habit
  listCheers: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Ensure the habit exists and belongs to the current user
      const habit = await ctx.prisma.habit.findUnique({
        where: { id: input.habitId, userId: ctx.userId },
      });

      if (!habit) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Habit not found.",
        });
      }

      return ctx.prisma.cheer.findMany({
        where: { habitId: input.habitId },
        include: {
          sender: { select: { id: true, email: true } }, // Assuming email is available
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Delete a single habit
  delete: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only allow deleting own habit
      const habit = await ctx.prisma.habit.findUnique({
        where: { id: input.habitId },
      });
      if (!habit || habit.userId !== ctx.userId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Habit not found" });
      }
      await ctx.prisma.habit.delete({ where: { id: input.habitId } });
      return { success: true };
    }),

  // Bulk delete habits
  deleteMany: protectedProcedure
    .input(z.object({ habitIds: z.array(z.string().min(1)) }))
    .mutation(async ({ ctx, input }) => {
      // Only allow deleting own habits
      await ctx.prisma.habit.deleteMany({
        where: {
          id: { in: input.habitIds },
          userId: ctx.userId,
        },
      });
      return { success: true };
    }),
});

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string, prisma: any) {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: userId,
        email: `user-${userId}@example.com`, // Placeholder email
      },
    });
  }
}

export function calculateStreak(completions: { date: Date }[]) {
  if (!completions.length) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCompletion = new Date(completions[0].date);
  lastCompletion.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - lastCompletion.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0;

  let streak = 1;
  let currentDate = new Date(lastCompletion);

  for (let i = 1; i < completions.length; i++) {
    const prevDate = new Date(completions[i].date);
    prevDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
}
