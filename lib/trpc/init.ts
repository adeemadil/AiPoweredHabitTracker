import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/lib/trpc/server";

// tRPC React client for the app
export const trpc = createTRPCReact<AppRouter>();
