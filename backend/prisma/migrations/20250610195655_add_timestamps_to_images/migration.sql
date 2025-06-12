/*
  Warnings:

  - You are about to drop the column `base64_data` on the `images` table. All the data in the column will be lost.
  - Added the required column `public_id` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "base64_data",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "public_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
