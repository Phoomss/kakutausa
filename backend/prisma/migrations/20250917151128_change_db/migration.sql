-- AlterTable
ALTER TABLE "public"."ProductModel" ADD COLUMN     "stepUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."Request3D" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "message" TEXT,
    "productId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Request3D_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Request3D" ADD CONSTRAINT "Request3D_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
