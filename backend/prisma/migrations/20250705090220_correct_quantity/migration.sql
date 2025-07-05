/*
  Warnings:

  - You are about to drop the column `quantity` on the `product_sizes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "product_sizes" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "product_variations" ADD COLUMN     "quantity" INTEGER;

-- AlterTable
ALTER TABLE "purchases" ADD COLUMN     "quantity" INTEGER;
