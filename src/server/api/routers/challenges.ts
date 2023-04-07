import { clerkClient } from "@clerk/nextjs/server";
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
  getTasksFromLastChallenge: publicProcedure.query(async ({ ctx }) => {
    const arr = await ctx.prisma.userChallenge.findMany({
      where: { userId: "clg6znmt30000wa9yrijn4kcv" },
      orderBy: { id: "desc" },
      take: 1,
      select: { challenge: { select: { point: true, tasks: true } } },
    });
    return arr[0];
  }),
  // setTasksCompleted: publicProcedure.mutation(({ ctx }) => {
  //   ctx.prisma.
  // }),
});
