/*
  Warnings:

  - Added the required column `endWishSelection` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startWishSelection` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "endWishSelection" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startWishSelection" TIMESTAMP(3) NOT NULL;
