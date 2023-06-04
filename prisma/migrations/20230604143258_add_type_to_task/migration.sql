-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "taskTypeId" INTEGER;

-- CreateTable
CREATE TABLE "TaskType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaskType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_taskTypeId_idx" ON "Task"("taskTypeId");
