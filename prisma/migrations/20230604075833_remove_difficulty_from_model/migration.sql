/*
  Warnings:

  - You are about to drop the column `difficultyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Difficulty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_difficultyId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "difficultyId";

-- DropTable
DROP TABLE "Difficulty";
