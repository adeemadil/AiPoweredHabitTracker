import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";
import { TRPCError } from "@trpc/server";

export const habitsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const habits = await ctx.prisma.habit.findMany({
      where: { userId: ctx.userId },
      include: {
        completions: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    return habits.map((habit) => ({
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.habit.create({
        data: {
          ...input,
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
});

function calculateStreak(completions: { date: Date }[]) {
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