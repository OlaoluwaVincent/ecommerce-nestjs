/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_ownerId_key" ON "Comment"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_ownerId_key" ON "Product"("ownerId");
