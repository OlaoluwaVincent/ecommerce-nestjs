/*
  Warnings:

  - You are about to drop the column `text` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `comment` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minOrderQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "onBoardStatus" AS ENUM ('REGISTERED', 'PRODUCT', 'ACCOUNTS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "text",
ADD COLUMN     "comment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "details",
DROP COLUMN "images",
DROP COLUMN "title",
ADD COLUMN     "minOrderQuantity" INTEGER NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ALTER COLUMN "available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userName",
ADD COLUMN     "onBoardStatus" "onBoardStatus" NOT NULL DEFAULT 'REGISTERED',
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT[],
    "productId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPhoto_id_key" ON "UserPhoto"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPhoto_ownerId_key" ON "UserPhoto"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_id_key" ON "Account"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Account_ownerId_key" ON "Account"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPhoto_id_key" ON "ProductPhoto"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPhoto_productId_key" ON "ProductPhoto"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ownerId_key" ON "Product"("ownerId");

-- AddForeignKey
ALTER TABLE "UserPhoto" ADD CONSTRAINT "UserPhoto_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPhoto" ADD CONSTRAINT "ProductPhoto_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
