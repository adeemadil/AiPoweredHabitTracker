import { z } from "zod";
import { router, protectedProcedure } from "../../trpc-base";
import { TRPCError } from "@trpc/server";

export const friendsRouter = router({
  // Send a friend request
  sendRequest: protectedProcedure
    .input(z.object({ friendId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.userId === input.friendId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot send a friend request to yourself.",
        });
      }

      const existingRequest = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: ctx.userId, friendId: input.friendId },
            { userId: input.friendId, friendId: ctx.userId },
          ],
        },
      });

      if (existingRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Friend request already sent or you are already friends.",
        });
      }

      return ctx.prisma.friendship.create({
        data: {
          userId: ctx.userId,
          friendId: input.friendId,
          status: "pending",
        },
      });
    }),

  // Accept a friend request
  acceptRequest: protectedProcedure
    .input(z.object({ friendshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.friendship.findUnique({
        where: { id: input.friendshipId, friendId: ctx.userId, status: "pending" },
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friend request not found or already accepted.",
        });
      }

      return ctx.prisma.friendship.update({
        where: { id: input.friendshipId },
        data: { status: "accepted" },
      });
    }),

  // Decline a friend request
  declineRequest: protectedProcedure
    .input(z.object({ friendshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.friendship.findUnique({
        where: { id: input.friendshipId, friendId: ctx.userId, status: "pending" },
      });

      if (!request) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friend request not found.",
        });
      }

      return ctx.prisma.friendship.update({
        where: { id: input.friendshipId },
        data: { status: "declined" },
      });
    }),

  // List friends
  listFriends: protectedProcedure.query(async ({ ctx }) => {
    const friendships = await ctx.prisma.friendship.findMany({
      where: {
        OR: [{ userId: ctx.userId }, { friendId: ctx.userId }],
        status: "accepted",
      },
      include: {
        user: { select: { id: true, email: true } }, // Information about the user who initiated the friendship
        friend: { select: { id: true, email: true } }, // Information about the friend
      },
    });

    // Map friendships to a more usable format
    return friendships.map(f => {
      const friendDetails = f.userId === ctx.userId ? f.friend : f.user;
      return {
        friendshipId: f.id,
        friendId: friendDetails.id,
        friendEmail: friendDetails.email, // Assuming email is available, adjust as needed
        status: f.status,
        createdAt: f.createdAt,
      };
    });
  }),

  // List pending friend requests
  listPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.friendship.findMany({
      where: {
        friendId: ctx.userId,
        status: "pending",
      },
      include: {
        user: { select: { id: true, email: true } }, // User who sent the request
      },
    });
  }),

  // Remove a friend
  removeFriend: protectedProcedure
    .input(z.object({ friendshipId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const friendship = await ctx.prisma.friendship.findFirst({
        where: {
          id: input.friendshipId,
          status: "accepted",
          OR: [{ userId: ctx.userId }, { friendId: ctx.userId }],
        },
      });

      if (!friendship) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Friendship not found.",
        });
      }

      return ctx.prisma.friendship.delete({
        where: { id: input.friendshipId },
      });
    }),
});
