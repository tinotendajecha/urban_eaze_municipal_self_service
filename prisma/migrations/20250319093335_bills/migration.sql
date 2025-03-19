/*
  Warnings:

  - You are about to drop the column `billId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the `Bill` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_billId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "billId",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "Bill";
