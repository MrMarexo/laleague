/*
  Warnings:

  - Made the column `userId` on table `UserChallengeTask` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserChallengeTask" ALTER COLUMN "userId" SET NOT NULL;
