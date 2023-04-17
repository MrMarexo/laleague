-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRank" (
    "id" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRank_rankId_idx" ON "UserRank"("rankId");

-- CreateIndex
CREATE INDEX "UserRank_userId_idx" ON "UserRank"("userId");
