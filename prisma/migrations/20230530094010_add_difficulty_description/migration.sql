/*
  Warnings:

  - Added the required column `description` to the `Difficulty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Difficulty" ADD COLUMN     "description" TEXT NOT NULL;
