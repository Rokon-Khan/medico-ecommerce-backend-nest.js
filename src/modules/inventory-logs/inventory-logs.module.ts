import { Module } from '@nestjs/common';
import { InventoryLogsService } from './inventory-logs.service';
import { InventoryLogsController } from './inventory-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLog } from './entities/inventory-log.entity';
import { ProductVariant } from '../product-variants/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLog, ProductVariant])],
  controllers: [InventoryLogsController],
  providers: [InventoryLogsService],
  exports: [InventoryLogsService],
})
export class InventoryLogsModule {}
