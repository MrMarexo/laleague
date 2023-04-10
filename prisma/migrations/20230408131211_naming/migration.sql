/*
  Warnings:

  - You are about to drop the column `taskCompleted` on the `UserChallengeTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserChallengeTask" DROP COLUMN "taskCompleted",
ADD COLUMN     "taskCompletedAt" TIMESTAMP(3);
