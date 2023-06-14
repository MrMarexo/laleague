/*
  Warnings:

  - You are about to drop the column `curChallengeExtraPoints` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `placements` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `placement` on the `UserChallenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "curChallengeExtraPoints",
DROP COLUMN "placements";

-- AlterTable
ALTER TABLE "UserChallenge" DROP COLUMN "placement";
