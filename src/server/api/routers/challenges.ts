import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const challengesRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),
  getAllChallenges: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({ select: { tasks: true } });
  }),
  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: { challenges: true, tasks: true },
    });
  }),
});
