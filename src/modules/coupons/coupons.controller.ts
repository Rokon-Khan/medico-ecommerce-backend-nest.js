// src/modules/coupons/coupons.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ApplyCouponDto, ValidateCouponDto } from './dto/validate-coupon.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('coupons')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /**
   * ✅ CREATE COUPON
   */
  @RequirePermissions(Permission.COUPON_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateCouponDto) {
    return this.couponsService.create(req, dto);
  }

  /**
   * ✅ GET ALL COUPONS
   */
  @RequirePermissions(Permission.COUPON_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.couponsService.findAll(req, query);
  }

  /**
   * ✅ GET ACTIVE COUPONS (Public)
   */
  @Get('active')
  findActive(@Query() query: any) {
    return this.couponsService.findActiveCoupons(query);
  }

  /**
   * ✅ GET SINGLE COUPON
   */
  @RequirePermissions(Permission.COUPON_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.couponsService.findOne(req, id);
  }

  /**
   * ✅ GET COUPON BY CODE (Public)
   */
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.couponsService.findByCode(code);
  }

  /**
   * ✅ UPDATE COUPON
   */
  @RequirePermissions(Permission.COUPON_UPDATE)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponsService.update(req, id, dto);
  }

  /**
   * ✅ DELETE COUPON
   */
  @RequirePermissions(Permission.COUPON_DELETE)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.couponsService.remove(req, id);
  }

  /**
   * ✅ VALIDATE COUPON (Public)
   */
  @Post('validate')
  validate(@Req() req: Request, @Body() dto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(req, dto);
  }

  /**
   * ✅ APPLY COUPON TO ORDER
   */
  @RequirePermissions(Permission.COUPON_APPLY)
  @Post('apply')
  apply(@Req() req: Request, @Body() dto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(req, dto);
  }

  /**
   * ✅ GET COUPON STATS
   */
  @RequirePermissions(Permission.COUPON_READ)
  @Get(':id/stats')
  getStats(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.couponsService.getCouponStats(id);
  }

  /**
   * ✅ GET USER COUPON HISTORY
   */
  @RequirePermissions(Permission.COUPON_READ)
  @Get('user/:userId/history')
  getUserHistory(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: any,
  ) {
    return this.couponsService.getUserCouponHistory(req, userId, query);
  }
}
