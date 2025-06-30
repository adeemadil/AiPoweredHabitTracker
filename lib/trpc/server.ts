import { router } from "../trpc-base";
import { habitsRouter } from "./routers/habits";
import { friendsRouter } from "./routers/friends"; // Import the new friends router

export const appRouter = router({
  habitTracker: habitsRouter,
  friends: friendsRouter, // Mount the friends router
});

export type AppRouter = typeof appRouter;
