/*
  Warnings:

  - You are about to drop the column `barMoves` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `drawingMovement` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `handleMoves` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `holdingCapacity` on the `size` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `size` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `size` DROP COLUMN `barMoves`,
    DROP COLUMN `drawingMovement`,
    DROP COLUMN `handleMoves`,
    DROP COLUMN `holdingCapacity`,
    DROP COLUMN `weight`,
    ADD COLUMN `barMovesInch` VARCHAR(191) NULL,
    ADD COLUMN `barMovesMetric` VARCHAR(191) NULL,
    ADD COLUMN `drawingMovementInch` VARCHAR(191) NULL,
    ADD COLUMN `drawingMovementMetric` VARCHAR(191) NULL,
    ADD COLUMN `handleMovesInch` VARCHAR(191) NULL,
    ADD COLUMN `handleMovesMetric` VARCHAR(191) NULL,
    ADD COLUMN `holdingCapacityInch` VARCHAR(191) NULL,
    ADD COLUMN `holdingCapacityMetric` VARCHAR(191) NULL,
    ADD COLUMN `weightInch` VARCHAR(191) NULL,
    ADD COLUMN `weightMetric` VARCHAR(191) NULL;
