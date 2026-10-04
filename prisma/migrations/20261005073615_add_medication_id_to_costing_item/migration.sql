-- AlterTable
ALTER TABLE `CostingItem` ADD COLUMN `medicationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `CostingItem` ADD CONSTRAINT `CostingItem_medicationId_fkey` FOREIGN KEY (`medicationId`) REFERENCES `Medication`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
