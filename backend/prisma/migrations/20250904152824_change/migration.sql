-- DropForeignKey
ALTER TABLE `content` DROP FOREIGN KEY `Content_contentTypeId_fkey`;

-- DropIndex
DROP INDEX `Content_contentTypeId_language_key` ON `content`;

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
