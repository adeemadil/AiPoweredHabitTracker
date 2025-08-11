/*
  Warnings:

  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('HABIT_REMINDER', 'FRIEND_REQUEST', 'REQUEST_ACCEPTED', 'NEW_CHEER', 'STREAK_MILESTONE', 'WEEKLY_SUMMARY', 'CHALLENGE_INVITE', 'CHALLENGE_JOINED', 'CHALLENGE_COMPLETED', 'CHALLENGE_MILESTONE');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;
