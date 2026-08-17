/*
  Warnings:

  - You are about to drop the column `DeletedAt` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "DeletedAt",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
