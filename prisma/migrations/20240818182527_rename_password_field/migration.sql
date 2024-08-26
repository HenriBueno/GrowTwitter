/*
  Warnings:

  - You are about to drop the column `passwords` on the `users` table. All the data in the column will be lost.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwords",
ADD COLUMN     "password" VARCHAR(100) NOT NULL;
