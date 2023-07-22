-- DropIndex
DROP INDEX "Product_ownerId_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categories" DROP NOT NULL;
