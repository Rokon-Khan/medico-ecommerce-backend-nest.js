import { Module } from '@nestjs/common';
import { CouponUsagesService } from './coupon-usages.service';
import { CouponUsagesController } from './coupon-usages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponUsage } from './entities/coupon-usage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponUsage])],
  controllers: [CouponUsagesController],
  providers: [CouponUsagesService],
  exports: [CouponUsagesService],
})
export class CouponUsagesModule {}
