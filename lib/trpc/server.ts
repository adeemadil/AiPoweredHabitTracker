import { router } from "../trpc-base";
import { habitsRouter } from "./routers/habits";
import { friendsRouter } from "./routers/friends"; // Import the new friends router
import { notificationsRouter } from "./routers/notifications";
import { settingsRouter } from "./routers/settings";

export const appRouter = router({
  habitTracker: habitsRouter,
  friends: friendsRouter, // Mount the friends router
  notifications: notificationsRouter, // Mount the notifications router
  settings: settingsRouter, // Mount the settings router
});

export type AppRouter = typeof appRouter;
