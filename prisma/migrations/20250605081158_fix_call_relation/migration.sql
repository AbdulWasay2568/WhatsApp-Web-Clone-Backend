/*
  Warnings:

  - Added the required column `updatedAt` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Call` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('RINGING', 'ACCEPTED', 'REJECTED', 'MISSED', 'ENDED');

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "CallStatus" NOT NULL;
