-- AlterTable
ALTER TABLE "UserChallengeTask" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "UserChallengeTask_userId_idx" ON "UserChallengeTask"("userId");
