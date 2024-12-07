/*
  Warnings:

  - The primary key for the `Action` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AId` on the `Action` table. All the data in the column will be lost.
  - The primary key for the `AvailableActions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `availableActionId` on the `AvailableActions` table. All the data in the column will be lost.
  - The primary key for the `AvailableTriggers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `availableTriggerId` on the `AvailableTriggers` table. All the data in the column will be lost.
  - The primary key for the `Trigger` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `TId` on the `Trigger` table. All the data in the column will be lost.
  - The primary key for the `Zap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ZId` on the `Zap` table. All the data in the column will be lost.
  - The primary key for the `ZapRun` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ZRId` on the `ZapRun` table. All the data in the column will be lost.
  - The required column `id` was added to the `Action` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `AvailableActions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `AvailableTriggers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Trigger` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Zap` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ZapRun` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_actionId_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_zapId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_triggerId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_zapId_fkey";

-- DropForeignKey
ALTER TABLE "ZapRun" DROP CONSTRAINT "ZapRun_zapId_fkey";

-- DropForeignKey
ALTER TABLE "ZapRunOutBox" DROP CONSTRAINT "ZapRunOutBox_zapRunId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP CONSTRAINT "Action_pkey",
DROP COLUMN "AId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Action_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AvailableActions" DROP CONSTRAINT "AvailableActions_pkey",
DROP COLUMN "availableActionId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "AvailableActions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AvailableTriggers" DROP CONSTRAINT "AvailableTriggers_pkey",
DROP COLUMN "availableTriggerId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "AvailableTriggers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_pkey",
DROP COLUMN "TId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_pkey",
DROP COLUMN "ZId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Zap_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ZapRun" DROP CONSTRAINT "ZapRun_pkey",
DROP COLUMN "ZRId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ZapRun_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTriggers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvailableActions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapRun" ADD CONSTRAINT "ZapRun_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapRunOutBox" ADD CONSTRAINT "ZapRunOutBox_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
