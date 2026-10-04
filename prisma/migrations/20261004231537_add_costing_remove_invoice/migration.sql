/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_petId_fkey`;

-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_invoiceId_fkey`;

-- DropTable
DROP TABLE `Invoice`;

-- DropTable
DROP TABLE `InvoiceItem`;

-- CreateTable
CREATE TABLE `Costing` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `petId` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` VARCHAR(191) NULL,
    `totalAmount` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostingItem` (
    `id` VARCHAR(191) NOT NULL,
    `costingId` VARCHAR(191) NOT NULL,
    `category` ENUM('CONSULTATION', 'MEDICATION', 'VACCINATION', 'OTHER') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DOUBLE NOT NULL,
    `total` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Costing` ADD CONSTRAINT `Costing_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Costing` ADD CONSTRAINT `Costing_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `Pet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CostingItem` ADD CONSTRAINT `CostingItem_costingId_fkey` FOREIGN KEY (`costingId`) REFERENCES `Costing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
