/*
  Warnings:

  - Added the required column `maxPoints` to the `Rank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minPoints` to the `Rank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rank" ADD COLUMN     "maxPoints" INTEGER NOT NULL,
ADD COLUMN     "minPoints" INTEGER NOT NULL;
