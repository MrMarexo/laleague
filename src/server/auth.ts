import { type GetServerSidePropsContext } from "next";
import GoogleProvider from "next-auth/providers/google";

import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user }) {
      const existingUserChallenge = await prisma.userChallenge.findFirst({
        where: { userId: user.id },
      });

      if (!existingUserChallenge) {
        // If the user doesn't have any UserChallenges, create a new one for them
        const challenge = await prisma.challenge.findFirst({
          include: { tasks: { select: { id: true } } },
        });

        if (challenge) {
          const userChallenge = await prisma.userChallenge.create({
            data: {
              user: { connect: { id: user.id } },
              challenge: { connect: { id: challenge.id } },
            },
          });

          if (challenge.tasks.length > 0) {
            for (let i = 0; i < challenge.tasks.length; i++) {
              await prisma.userChallengeTask.create({
                data: {
                  userChallenge: { connect: { id: userChallenge.id } },
                  // @ts-ignore
                  task: { connect: { id: challenge.tasks[i].id } },
                },
              });
            }
          }
        }
      }
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
