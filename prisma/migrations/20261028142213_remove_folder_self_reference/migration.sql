/*
  Warnings:

  - You are about to drop the column `parentFolderId` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `name` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "parentFolderId",
ADD COLUMN     "name" TEXT NOT NULL;
