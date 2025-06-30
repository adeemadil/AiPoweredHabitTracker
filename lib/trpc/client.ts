// Deprecated: Use trpc from '@/lib/trpc/init' instead.

import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "./server";

export const trpc = createTRPCReact<AppRouter>();
