import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTrackingService } from './order-tracking.service';
import { OrderTrackingController } from './order-tracking.controller';
import { OrderTracking } from './entities/order-tracking.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTracking, Order])],
  controllers: [OrderTrackingController],
  providers: [OrderTrackingService],
  exports: [OrderTrackingService],
})
export class OrderTrackingModule {}
