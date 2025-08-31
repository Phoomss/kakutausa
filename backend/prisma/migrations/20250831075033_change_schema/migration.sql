/*
  Warnings:

  - You are about to drop the column `binUrl` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `gltfUrl` on the `ProductImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AddressType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentTypeId,language]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ContentType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Address" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Content" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductImage" DROP COLUMN "binUrl",
DROP COLUMN "gltfUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."ProductModel" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "gltfUrl" TEXT,
    "binUrl" TEXT,

    CONSTRAINT "ProductModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AddressType_name_key" ON "public"."AddressType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Content_contentTypeId_language_key" ON "public"."Content"("contentTypeId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_name_key" ON "public"."ContentType"("name");

-- AddForeignKey
ALTER TABLE "public"."ProductModel" ADD CONSTRAINT "ProductModel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
