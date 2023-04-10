-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "startDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserChallenge" ADD COLUMN     "isCompleted" BOOLEAN;
