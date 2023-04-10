-- CreateTable
CREATE TABLE "UserChallengeTask" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userChallengeId" TEXT NOT NULL,

    CONSTRAINT "UserChallengeTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserChallengeTask_userChallengeId_idx" ON "UserChallengeTask"("userChallengeId");

-- CreateIndex
CREATE INDEX "UserChallengeTask_taskId_idx" ON "UserChallengeTask"("taskId");
