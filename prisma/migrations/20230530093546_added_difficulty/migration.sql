-- AlterTable
ALTER TABLE "User" ADD COLUMN     "difficultyId" INTEGER;

-- CreateTable
CREATE TABLE "Difficulty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_difficultyId_idx" ON "User"("difficultyId");
