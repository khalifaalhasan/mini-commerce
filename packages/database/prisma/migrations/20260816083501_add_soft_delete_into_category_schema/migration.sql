-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "DeletedAt" SET DATA TYPE TIMESTAMP(3);
