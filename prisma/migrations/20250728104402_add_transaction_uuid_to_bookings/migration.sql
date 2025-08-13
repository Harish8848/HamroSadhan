/*
  Warnings:

  - A unique constraint covering the columns `[transaction_uuid]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "transaction_uuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_transaction_uuid_key" ON "bookings"("transaction_uuid");
