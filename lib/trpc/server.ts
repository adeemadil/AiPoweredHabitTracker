import { router } from "../trpc-base";
import { habitsRouter } from "./routers/habits";
import { friendsRouter } from "./routers/friends"; // Import the new friends router
import { notificationsRouter } from "./routers/notifications";

export const appRouter = router({
  habitTracker: habitsRouter,
  friends: friendsRouter, // Mount the friends router
  notifications: notificationsRouter, // Mount the notifications router
});

export type AppRouter = typeof appRouter;
