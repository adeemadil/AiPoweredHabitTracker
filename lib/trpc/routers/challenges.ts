import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";
import { AIChallengeService } from "../../ai-challenges";
import { NotificationService } from "../../notifications";
import { NotificationType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const challengeSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  type: z.enum(["STREAK_BASED", "FREQUENCY_BASED", "TIME_BASED", "SOCIAL_BASED", "MIXED"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
  duration: z.number().min(1).max(365),
  maxParticipants: z.number().optional(),
  isPublic: z.boolean().default(true),
});

const progressSchema = z.object({
  challengeId: z.string(),
  date: z.date(),
  completed: z.boolean(),
  notes: z.string().optional(),
});

export const challengesRouter = router({
  // Get all available challenges (public and user's own)
  list: protectedProcedure.query(async ({ ctx }) => {
    const challenges = await ctx.prisma.challenge.findMany({
      where: {
        OR: [
          { isPublic: true },
          { creatorId: ctx.user.id },
        ],
        isActive: true,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return challenges;
  }),

  // Get challenges created by the user
  myCreated: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.challenge.findMany({
      where: {
        creatorId: ctx.user.id,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Get challenges the user is participating in
  myParticipating: protectedProcedure.query(async ({ ctx }) => {
    const participations = await ctx.prisma.challengeParticipant.findMany({
      where: {
        userId: ctx.user.id,
        isActive: true,
      },
      include: {
        challenge: {
          include: {
            creator: {
              select: {
                id: true,
                email: true,
              },
            },
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            },
            _count: {
              select: {
                participants: true,
              },
            },
          },
        },
        progress: {
          orderBy: {
            date: "desc",
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return participations;
  }),

  // Get a specific challenge with details
  getById: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const challenge = await ctx.prisma.challenge.findUnique({
        where: {
          id: input.challengeId,
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
              progress: {
                orderBy: {
                  date: "desc",
                },
              },
            },
          },
        },
      });

      if (!challenge) {
        throw new Error("Challenge not found");
      }

      return challenge;
    }),

  // Create a new challenge
  create: protectedProcedure
    .input(challengeSchema)
    .mutation(async ({ ctx, input }) => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + input.duration);

      const challenge = await ctx.prisma.challenge.create({
        data: {
          ...input,
          creatorId: ctx.user.id,
          startDate,
          endDate,
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return challenge;
    }),

  // Join a challenge
  join: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if challenge exists and is active
      const challenge = await ctx.prisma.challenge.findUnique({
        where: { id: input.challengeId },
      });

      if (!challenge || !challenge.isActive) {
        throw new Error("Challenge not found or inactive");
      }

      // Check if user is already participating
      const existingParticipation = await ctx.prisma.challengeParticipant.findUnique({
        where: {
          challengeId_userId: {
            challengeId: input.challengeId,
            userId: ctx.user.id,
          },
        },
      });

      if (existingParticipation) {
        throw new Error("Already participating in this challenge");
      }

      // Check participant limit
      if (challenge.maxParticipants) {
        const participantCount = await ctx.prisma.challengeParticipant.count({
          where: { challengeId: input.challengeId },
        });

        if (participantCount >= challenge.maxParticipants) {
          throw new Error("Challenge is full");
        }
      }

      const participation = await ctx.prisma.challengeParticipant.create({
        data: {
          challengeId: input.challengeId,
          userId: ctx.user.id,
        },
        include: {
          challenge: {
            include: {
              creator: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Send notification to challenge creator
      if (challenge.creatorId !== ctx.user.id) {
        await NotificationService.createNotification({
          type: "CHALLENGE_JOINED" as const,
          userId: challenge.creatorId,
          message: `${ctx.user.email} joined your challenge "${challenge.title}"!`,
          relatedEntityId: participation.id,
        });
      }

      return participation;
    }),

  // Leave a challenge
  leave: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const participation = await ctx.prisma.challengeParticipant.findUnique({
        where: {
          challengeId_userId: {
            challengeId: input.challengeId,
            userId: ctx.user.id,
          },
        },
      });

      if (!participation) {
        throw new Error("Not participating in this challenge");
      }

      await ctx.prisma.challengeParticipant.update({
        where: { id: participation.id },
        data: { isActive: false },
      });

      return { success: true };
    }),

  // Update challenge progress
  updateProgress: protectedProcedure
    .input(progressSchema)
    .mutation(async ({ ctx, input }) => {
      // Find user's participation
      const participation = await ctx.prisma.challengeParticipant.findUnique({
        where: {
          challengeId_userId: {
            challengeId: input.challengeId,
            userId: ctx.user.id,
          },
        },
      });

      if (!participation) {
        throw new Error("Not participating in this challenge");
      }

      // Update or create progress entry
      const progress = await ctx.prisma.challengeProgress.upsert({
        where: {
          participantId_date: {
            participantId: participation.id,
            date: input.date,
          },
        },
        update: {
          completed: input.completed,
          notes: input.notes,
        },
        create: {
          participantId: participation.id,
          date: input.date,
          completed: input.completed,
          notes: input.notes,
        },
      });

      return progress;
    }),

  // Get AI-generated challenge suggestions
  getAISuggestions: protectedProcedure
    .input(z.object({ count: z.number().min(1).max(5).default(3) }))
    .query(async ({ ctx, input }) => {
      try {
        // Get user's habits for personalization
        const userHabits = await ctx.prisma.habit.findMany({
          where: { userId: ctx.user.id },
        });

        console.log(`Generating AI suggestions for user ${ctx.user.id} with ${userHabits.length} habits`);

        const suggestions = await AIChallengeService.generatePersonalizedChallenges(
          userHabits,
          input.count
        );

        console.log(`Generated ${suggestions.length} AI suggestions`);
        return suggestions;
      } catch (error) {
        console.error('Error in getAISuggestions:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate AI suggestions. Please try again.',
        });
      }
    }),

  // Create a challenge from AI suggestion
  createFromSuggestion: protectedProcedure
    .input(challengeSchema.extend({
      aiPrompt: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + input.duration);

      const challenge = await ctx.prisma.challenge.create({
        data: {
          title: input.title,
          description: input.description,
          type: input.type,
          difficulty: input.difficulty,
          duration: input.duration,
          maxParticipants: input.maxParticipants,
          isPublic: input.isPublic,
          creatorId: ctx.user.id,
          startDate,
          endDate,
          aiGenerated: true,
          aiPrompt: input.aiPrompt,
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return challenge;
    }),

  // Get challenge leaderboard
  getLeaderboard: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const participants = await ctx.prisma.challengeParticipant.findMany({
        where: {
          challengeId: input.challengeId,
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          progress: {
            where: {
              completed: true,
            },
          },
        },
        orderBy: [
          {
            progress: {
              _count: "desc",
            },
          },
          {
            joinedAt: "asc",
          },
        ],
      });

      return participants.map((participant, index) => ({
        rank: index + 1,
        userId: participant.user.id,
        email: participant.user.email,
        completedDays: participant.progress.length,
        joinedAt: participant.joinedAt,
      }));
    }),

  // Get AI insights for a challenge
  getAIInsights: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const participation = await ctx.prisma.challengeParticipant.findUnique({
        where: {
          challengeId_userId: {
            challengeId: input.challengeId,
            userId: ctx.user.id,
          },
        },
        include: {
          progress: {
            orderBy: {
              date: "desc",
            },
          },
          challenge: true,
        },
      });

      if (!participation) {
        throw new Error("Not participating in this challenge");
      }

      const insights = await AIChallengeService.generateChallengeInsights(
        input.challengeId,
        {
          challenge: participation.challenge,
          progress: participation.progress,
          totalDays: participation.challenge.duration,
          completedDays: participation.progress.filter(p => p.completed).length,
        }
      );

      return insights;
    }),
});
