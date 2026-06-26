// src/modules/coupon-usages/coupon-usages.controller.ts
import {
  Controller,
  Get,
  Param,
  Req,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { CouponUsagesService } from './coupon-usages.service';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('coupon-usages')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class CouponUsagesController {
  constructor(private readonly couponUsagesService: CouponUsagesService) {}

  /**
   * ✅ GET ALL COUPON USAGES (Admin only)
   * অ্যাডমিন সব কুপন ইউসেজ দেখতে পারে
   */
  @RequirePermissions(Permission.COUPON_USAGE_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.couponUsagesService.findAll(req, query);
  }

  /**
   * ✅ GET USER COUPON USAGE HISTORY
   * ইউজার নিজের ইতিহাস দেখতে পারে
   * অ্যাডমিন যেকোনো ইউজারের ইতিহাস দেখতে পারে
   */
  @RequirePermissions(Permission.COUPON_USAGE_READ)
  @Get('user/:userId')
  getUserHistory(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: any,
  ) {
    return this.couponUsagesService.getUserHistory(req, userId, query);
  }

  /**
   * ✅ GET COUPON USAGE STATS (Admin only)
   * কোনো কুপনের পরিসংখ্যান
   */
  @RequirePermissions(Permission.COUPON_USAGE_READ)
  @Get('stats/coupon/:couponId')
  getCouponStats(
    @Req() req: Request,
    @Param('couponId', ParseUUIDPipe) couponId: string,
  ) {
    return this.couponUsagesService.getCouponUsageStats(req, couponId);
  }

  /**
   * ✅ GET COUPON USAGE BY ORDER
   * কোনো অর্ডারের কুপন ইউসেজ
   */
  @RequirePermissions(Permission.COUPON_USAGE_READ)
  @Get('order/:orderId')
  getOrderUsage(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.couponUsagesService.getOrderCouponUsage(req, orderId);
  }

  /**
   * ✅ GET SINGLE COUPON USAGE
   */
  @RequirePermissions(Permission.COUPON_USAGE_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.couponUsagesService.findOne(req, id);
  }
}
