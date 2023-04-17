/*
  Warnings:

  - The primary key for the `Rank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Rank` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `UserRank` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rankId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rank" DROP CONSTRAINT "Rank_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Rank_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rankId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserRank";

-- CreateIndex
CREATE INDEX "User_rankId_idx" ON "User"("rankId");
