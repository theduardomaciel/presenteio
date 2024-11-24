/*
  Warnings:

  - A unique constraint covering the columns `[customHash]` on the table `guests` will be added. If there are existing duplicate values, this will fail.
  - The required column `customHash` was added to the `guests` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "customHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "guests_customHash_key" ON "guests"("customHash");
