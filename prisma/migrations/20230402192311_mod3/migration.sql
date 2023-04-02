/*
  Warnings:

  - Changed the type of `images` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `categories` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images",
ADD COLUMN     "images" JSONB NOT NULL,
DROP COLUMN "categories",
ADD COLUMN     "categories" JSONB NOT NULL;

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "ImageFormat";
