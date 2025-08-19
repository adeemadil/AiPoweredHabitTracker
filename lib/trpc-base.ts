import { initTRPC, TRPCError } from "@trpc/server";
import { getAuth } from "@clerk/nextjs/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "./prisma";

const t = initTRPC.context<{ req: any; prisma: typeof prisma }>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  // Get user from database
  const user = await ctx.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  return next({
    ctx: {
      userId,
      user,
      prisma,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
