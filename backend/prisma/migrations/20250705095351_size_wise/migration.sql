/*
  Warnings:

  - You are about to drop the column `quantity` on the `product_variations` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `product_variations` table. All the data in the column will be lost.
  - You are about to drop the `_VariationSizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_VariationSizes" DROP CONSTRAINT "_VariationSizes_A_fkey";

-- DropForeignKey
ALTER TABLE "_VariationSizes" DROP CONSTRAINT "_VariationSizes_B_fkey";

-- AlterTable
ALTER TABLE "product_variations" DROP COLUMN "quantity",
DROP COLUMN "stock";

-- DropTable
DROP TABLE "_VariationSizes";

-- CreateTable
CREATE TABLE "variation_sizes" (
    "id" TEXT NOT NULL,
    "variation_id" TEXT NOT NULL,
    "size_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variation_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "variation_sizes_variation_id_idx" ON "variation_sizes"("variation_id");

-- CreateIndex
CREATE INDEX "variation_sizes_size_id_idx" ON "variation_sizes"("size_id");

-- CreateIndex
CREATE UNIQUE INDEX "variation_sizes_variation_id_size_id_key" ON "variation_sizes"("variation_id", "size_id");

-- AddForeignKey
ALTER TABLE "variation_sizes" ADD CONSTRAINT "variation_sizes_variation_id_fkey" FOREIGN KEY ("variation_id") REFERENCES "product_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variation_sizes" ADD CONSTRAINT "variation_sizes_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "product_sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
