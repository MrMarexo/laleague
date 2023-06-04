-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "difficultyId" INTEGER;

-- CreateTable
CREATE TABLE "Difficulty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Difficulty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_difficultyId_idx" ON "Task"("difficultyId");
