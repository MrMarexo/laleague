import { z } from "zod";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const challengesRouter = createTRPCRouter({
  // onNewUser: protectedProcedure.subscription(() => {
  //   console.log()
  //   return;
  // }),
  getAchievedRanks: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        rankId: true,
      },
    });
    if (!user || !user.rankId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `CURRENT USER OR HIS RANK NOT FOUND`,
      });
    }

    const nextRank = await ctx.prisma.rank.findUnique({
      where: {
        id: user.rankId + 1,
      },
      select: {
        minPoints: true,
      },
    });

    const achievedRanks = await ctx.prisma.rank.findMany({
      where: {
        id: { lte: user.rankId },
      },
      select: {
        id: true,
        minPoints: true,
        name: true,
      },
    });

    return {
      achievedRanks,
      nextRank,
    };
  }),
  getTasksFromLastChallenge: protectedProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    const currentChallenge = await ctx.prisma.challenge.findFirst({
      where: {
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      select: {
        id: true,
        tasks: true,
      },
    });
    if (!currentChallenge) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `CURRENTCHALLENGE NOT FOUND`,
      });
    }
    const getUserChallenge = async () => {
      return await ctx.prisma.userChallenge.findFirst({
        where: {
          userId: ctx.session.user.id,
          challengeId: currentChallenge.id,
        },
        orderBy: { id: "desc" },
        take: 1,
        select: {
          challenge: {
            select: { id: true, extraPoints: true, title: true, endDate: true },
          },
          dateCompleted: true,
          id: true,
          userChallengeTasks: {
            orderBy: {
              task: {
                difficultyId: "asc",
              },
            },
            select: {
              task: {
                select: {
                  title: true,
                  taskType: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  description: true,
                  id: true,
                  difficulty: {
                    select: {
                      id: true,
                      points: true,
                      name: true,
                    },
                  },
                },
              },
              notes: true,
              taskCompletedAt: true,
              id: true,
            },
          },
        },
      });
    };
    const curUserChallenge = await getUserChallenge();

    if (!curUserChallenge) {
      const userChallenge = await ctx.prisma.userChallenge.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          challenge: { connect: { id: currentChallenge.id } },
        },
      });
      if (currentChallenge.tasks.length > 0) {
        for (let i = 0; i < currentChallenge.tasks.length; i++) {
          const curTask = currentChallenge.tasks[i];
          if (curTask) {
            await ctx.prisma.userChallengeTask.create({
              data: {
                userChallenge: { connect: { id: userChallenge.id } },
                task: { connect: { id: curTask.id } },
                user: { connect: { id: ctx.session.user.id } },
              },
            });
          }
        }
      }

      const newChallenge = await getUserChallenge();
      return newChallenge;
    }
    return curUserChallenge;
  }),
  setTaskValues: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        isCompleted: z.boolean(),
        userChallengeId: z.string(),
        challengeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const taskUpdateRes = await ctx.prisma.userChallengeTask
        .update({
          where: { id: input.taskId },
          data: {
            taskCompletedAt: input.isCompleted ? new Date() : null,
          },
          select: {
            id: true,
            task: {
              select: {
                difficulty: {
                  select: {
                    points: true,
                  },
                },
              },
            },
          },
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
                extraPoints: true,
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

      const pointsWithTaskCompleted =
        userChallenge.user.points + taskUpdateRes.task.difficulty.points;

      const getRanks = async (
        points: number
      ): Promise<Array<{ id: number }>> => {
        return await ctx.prisma
          .$queryRaw`SELECT id FROM "Rank" WHERE "maxPoints" >= ${points} AND "minPoints" <= ${points};`;
      };

      const newRanks = await getRanks(pointsWithTaskCompleted);

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          points: pointsWithTaskCompleted,
          rank: {
            connect: {
              id: newRanks[0]?.id,
            },
          },
        },
      });

      const allTasksComplete = userChallenge.userChallengeTasks.every(
        (task) => !!task.taskCompletedAt
      );

      if (allTasksComplete) {
        // const completedChallengesCount = await ctx.prisma.userChallenge.count({
        //   where: {
        //     challengeId: input.challengeId,
        //     isCompleted: true,
        //   },
        // });

        // const { extraPoints, placement } = calculatePoints(
        //   completedChallengesCount
        // );

        const pointsCalculated =
          pointsWithTaskCompleted + userChallenge.challenge.extraPoints;

        const finalizedRanks = await getRanks(pointsCalculated);

        await ctx.prisma.userChallenge.update({
          where: { id: input.userChallengeId },
          data: {
            dateCompleted: new Date(),
            isCompleted: true,
            user: {
              update: {
                points: pointsCalculated,
                rank: {
                  connect: {
                    id: finalizedRanks[0]!.id,
                  },
                },
              },
            },
          },
        });
      }
      return taskUpdateRes;
    }),
  getCurrentChallenge: publicProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    return await ctx.prisma.challenge.findFirst({
      where: {
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      select: {
        id: true,
        tasks: {
          orderBy: {
            difficultyId: "asc",
          },
          include: {
            difficulty: {
              select: {
                points: true,
              },
            },
          },
        },
        extraPoints: true,
        title: true,
        endDate: true,
      },
    });
  }),
  getCompletedUsers: publicProcedure
    .input(z.object({ searchType: z.number() }))
    .query(async ({ ctx, input }) => {
      const currentDate = new Date();
      const curentChallenge = await ctx.prisma.challenge.findFirst({
        where: {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        select: {
          id: true,
        },
      });
      const curChallengeId = curentChallenge?.id;
      if (!curChallengeId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `CURRENTCHALLENGE NOT FOUND`,
        });
      }
      const users: Array<{
        name: string | null;
        id: string;
        dateCompleted: Date | null;
      }> = [];

      if (input.searchType === 99) {
        const userChallenges = await ctx.prisma.userChallenge.findMany({
          where: {
            challengeId: curChallengeId,
            isCompleted: true,
          },
          orderBy: {
            dateCompleted: "asc",
          },
          include: {
            userChallengeTasks: {
              select: {
                taskCompletedAt: true,
                task: {
                  select: {
                    difficultyId: true,
                  },
                },
              },
            },
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        });

        userChallenges.forEach(({ dateCompleted, user: { id, name } }) => {
          users.push({ id, name, dateCompleted });
        });

        return users;
      }

      const resTask = await ctx.prisma.userChallengeTask.findMany({
        where: {
          userChallenge: {
            challengeId: curChallengeId,
          },
          taskCompletedAt: {
            not: null,
          },
          task: {
            difficultyId: input.searchType,
          },
        },
        select: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          taskCompletedAt: true,
        },
      });

      resTask.forEach(({ user: { name, id }, taskCompletedAt }) => {
        users.push({ id, name, dateCompleted: taskCompletedAt });
      });

      return users;
    }),
  getLeaderboard: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      orderBy: {
        points: "desc",
      },
      take: 10,
      select: {
        name: true,
        rankId: true,
        points: true,
        id: true,
      },
    });
  }),

  getMyPreviousChallenges: protectedProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    return await ctx.prisma.userChallenge.findMany({
      where: {
        userId: ctx.session.user.id,
        challenge: {
          endDate: { lte: currentDate },
        },
      },
      orderBy: {
        challenge: {
          endDate: "desc",
        },
      },
      take: 9,
      select: {
        isCompleted: true,
        userChallengeTasks: {
          select: {
            taskCompletedAt: true,
            task: {
              select: {
                title: true,
              },
            },
          },
        },
        challenge: {
          select: {
            endDate: true,
            title: true,
          },
        },
      },
    });
  }),

  setUserName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
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
      const numberOfCompletedTasks = await ctx.prisma.userChallengeTask.count({
        where: {
          userId: input.userId,
          taskCompletedAt: {
            not: null,
          },
        },
      });
      const numberOfCompletedChallenges = await ctx.prisma.userChallenge.count({
        where: {
          userId: input.userId,
          isCompleted: true,
        },
      });

      return {
        id: user.id,
        name: user.name,
        rank: user.rank,
        numberOfCompletedChallenges,
        numberOfAttendedChallenges,
        points: user.points,
        numberOfCompletedTasks,
      };
    }),
});
