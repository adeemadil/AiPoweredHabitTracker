import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/lib/trpc/server";
import { prisma } from "@/lib/prisma";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ req: req as any, prisma }),
  });

export { handler as GET, handler as POST }; 