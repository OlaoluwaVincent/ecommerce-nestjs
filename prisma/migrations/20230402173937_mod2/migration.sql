/*
  Warnings:

  - The `categories` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `images` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Comment_ownerId_key";

-- DropIndex
DROP INDEX "Product_ownerId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images",
ADD COLUMN     "images" "ImageFormat" NOT NULL,
DROP COLUMN "categories",
ADD COLUMN     "categories" "Category";
