import { router } from "../trpc-base";
import { habitsRouter } from "./routers/habits";

export const appRouter = router({
  habitTracker: habitsRouter,
});

export type AppRouter = typeof appRouter; 