import { prisma } from "~/server/db";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const challengesRouter = createTRPCRouter({
  getAllChallenges: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({ select: { tasks: true } });
  }),
  getTasksFromLastChallenge: protectedProcedure.query(async ({ ctx }) => {
    const arr = await ctx.prisma.userChallenge.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { id: "desc" },
      take: 1,
      select: {
        challenge: { select: { point: true } },
        dateCompleted: true,
        id: true,
        userChallengeTasks: {
          select: {
            task: true,
            notes: true,
            taskCompletedAt: true,
            id: true,
          },
        },
      },
    });
    return arr[0];
  }),
  setTaskValues: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        isCompleted: z.boolean(),
        userChallengeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const taskUpdateRes = await ctx.prisma.userChallengeTask
        .update({
          where: { id: input.taskId },
          data: {
            taskCompletedAt: input.isCompleted ? new Date() : null,
          },
          select: { id: true },
        })
        .catch(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `USERCHALLENGETASK ${input.taskId} NOT UPDATED`,
          });
        });
      const userChallenge = await ctx.prisma.userChallenge
        .findUnique({
          where: { id: input.userChallengeId },
          select: {
            userChallengeTasks: true,
            challenge: {
              select: {
                point: true,
              },
            },
            user: {
              select: {
                points: true,
              },
            },
          },
        })
        .catch((e) => console.log("ERROR", e));
      if (!userChallenge) {
        return taskUpdateRes;
      }
      const allTasksComplete = userChallenge.userChallengeTasks.every(
        (task) => !!task.taskCompletedAt
      );
      const completedChallenges = await ctx.prisma.userChallenge.findMany({
        where: {
          challengeId: input.userChallengeId,
          isCompleted: true,
        },
      });

      const getExtraPoints = () => {
        if (completedChallenges.length === 0) {
          return 3;
        }
        if (completedChallenges.length === 1) {
          return 2;
        }
        if (completedChallenges.length === 3) {
          return 1;
        }
        return 0;
      };

      if (allTasksComplete) {
        await ctx.prisma.userChallenge.update({
          where: { id: input.userChallengeId },
          data: {
            dateCompleted: new Date(),
            isCompleted: true,
            user: {
              update: {
                points:
                  userChallenge.user.points +
                  userChallenge.challenge.point +
                  getExtraPoints(),
                curChallengeExtraPoints: getExtraPoints(),
              },
            },
          },
        });
      }
      return taskUpdateRes;
    }),
  getCurrentChallenge: publicProcedure.query(async ({ ctx }) => {
    const challengeArr = await ctx.prisma.challenge.findMany({
      orderBy: { startDate: "desc" },
      take: 1,
      select: {
        id: true,
        tasks: true,
        point: true,
      },
    });
    if (!challengeArr.length) {
      return null;
    }
    return challengeArr[0];
  }),
  getCompletedUsers: publicProcedure.query(async ({ ctx }) => {
    const curentChallenge = await ctx.prisma.challenge.findMany({
      orderBy: { startDate: "desc" },
      take: 1,
      select: {
        id: true,
      },
    });
    const curChallengeId = curentChallenge[0]?.id;
    if (!curChallengeId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `CURRENTCHALLENGE NOT FOUND`,
      });
    }
    return await ctx.prisma.userChallenge.findMany({
      where: {
        challengeId: curChallengeId,
        isCompleted: true,
      },
      orderBy: {
        dateCompleted: "asc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }),
});
