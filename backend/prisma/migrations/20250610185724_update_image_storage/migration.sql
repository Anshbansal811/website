/*
  Warnings:

  - You are about to drop the column `url` on the `images` table. All the data in the column will be lost.
  - Added the required column `base64_data` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "url",
ADD COLUMN     "base64_data" TEXT NOT NULL;
