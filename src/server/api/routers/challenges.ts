import { calculatePoints } from "./../../../utils/fns";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// import { EventEmitter } from 'events';

export const challengesRouter = createTRPCRouter({
  // onNewUser: protectedProcedure.subscription(() => {
  //   console.log()
  //   return;
  // }),
  getAllChallenges: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({ select: { tasks: true } });
  }),
  getTasksFromLastChallenge: protectedProcedure.query(async ({ ctx }) => {
    const getArray = async () => {
      return await ctx.prisma.userChallenge.findMany({
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
    };
    const arr = await getArray();

    if (arr.length === 0) {
      const challenge = await ctx.prisma.challenge.findFirst({
        include: { tasks: { select: { id: true } } },
      });

      if (challenge) {
        const userChallenge = await ctx.prisma.userChallenge.create({
          data: {
            user: { connect: { id: ctx.session.user.id } },
            challenge: { connect: { id: challenge.id } },
          },
        });
        if (challenge.tasks.length > 0) {
          for (let i = 0; i < challenge.tasks.length; i++) {
            const curTask = challenge.tasks[i];
            if (curTask) {
              await ctx.prisma.userChallengeTask.create({
                data: {
                  userChallenge: { connect: { id: userChallenge.id } },
                  task: { connect: { id: curTask.id } },
                },
              });
            }
          }
        }

        const newArr = await getArray();
        return newArr[0];
      }
    }
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

      const { extraPoints, placement } = calculatePoints(
        completedChallenges.length
      );

      if (allTasksComplete) {
        await ctx.prisma.userChallenge.update({
          where: { id: input.userChallengeId },
          data: {
            dateCompleted: new Date(),
            isCompleted: true,
            placement,
            user: {
              update: {
                points:
                  userChallenge.user.points +
                  userChallenge.challenge.point +
                  extraPoints,
                curChallengeExtraPoints: extraPoints,
                placements: {
                  push: placement,
                },
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
  getUserResults: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          points: true,
          name: true,
          rank: true,
          placements: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `CURRENT USER NOT FOUND`,
        });
      }

      const numberOfAttendedChallenges = await ctx.prisma.userChallenge.count({
        where: {
          userId: input.userId,
        },
      });

      const numberOfCompletedChallenges = user.placements.length;
      const numberOfPodiums = user.placements.filter((p) => p <= 3).length;
      const numberOfFirst = user.placements.filter((p) => p === 1).length;

      return {
        id: user.id,
        name: user.name,
        rank: user.rank,
        numberOfCompletedChallenges,
        numberOfAttendedChallenges,
        numberOfPodiums,
        numberOfFirst,
      };
    }),
});
