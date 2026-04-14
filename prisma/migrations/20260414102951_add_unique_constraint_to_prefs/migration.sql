/*
  Warnings:

  - A unique constraint covering the columns `[userId,gameId]` on the table `UserPreference` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GameDescription" DROP CONSTRAINT "GameDescription_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameTag" DROP CONSTRAINT "GameTag_gameId_fkey";

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_userId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_gameId_key" ON "UserPreference"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "GameDescription" ADD CONSTRAINT "GameDescription_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameTag" ADD CONSTRAINT "GameTag_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
