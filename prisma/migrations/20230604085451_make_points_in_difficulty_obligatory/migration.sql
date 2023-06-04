/*
  Warnings:

  - Made the column `points` on table `Difficulty` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Difficulty" ALTER COLUMN "points" SET NOT NULL;
