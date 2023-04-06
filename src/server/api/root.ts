import { createTRPCRouter } from "~/server/api/trpc";
import { challengesRouter } from "~/server/api/routers/challenges";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  challenges: challengesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
