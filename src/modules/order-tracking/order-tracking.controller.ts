// src/modules/order-tracking/order-tracking.controller.ts
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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { OrderTrackingService } from './order-tracking.service';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import {
  BulkUpdateOrderStatusDto,
  OrderTrackingFilterDto,
  UpdateOrderStatusDto,
} from './dto/update-order-tracking.dto';

@ApiTags('Order Tracking')
@ApiBearerAuth()
@Controller('order-tracking')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class OrderTrackingController {
  constructor(private readonly trackingService: OrderTrackingService) {}

  /**
   * ✅ Update Order Status
   */
  @ApiOperation({ summary: 'Update single order status' })
  @RequirePermissions(Permission.ORDER_TRACKING_UPDATE)
  @Patch(':orderId/status')
  updateStatus(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.trackingService.updateStatus(req, orderId, dto);
  }

  /**
   * ✅ Bulk Update Order Status
   */
  @ApiOperation({ summary: 'Bulk update order status' })
  @RequirePermissions(Permission.ORDER_TRACKING_UPDATE)
  @Post('bulk-status')
  bulkUpdateStatus(@Req() req: Request, @Body() dto: BulkUpdateOrderStatusDto) {
    return this.trackingService.bulkUpdateStatus(req, dto);
  }

  /**
   * ✅ Get Order Tracking Detail
   */
  @ApiOperation({ summary: 'Get order tracking detail' })
  @RequirePermissions(Permission.ORDER_TRACKING_READ)
  @Get(':orderId')
  getTrackingDetail(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.trackingService.getOrderTrackingDetail(orderId);
  }

  /**
   * ✅ Get Order Tracking History
   */
  @ApiOperation({ summary: 'Get order tracking history' })
  @RequirePermissions(Permission.ORDER_TRACKING_READ)
  @Get()
  getTrackingHistory(
    @Req() req: Request,
    @Query() filter: OrderTrackingFilterDto,
  ) {
    return this.trackingService.getTrackingHistory(req, filter);
  }

  /**
   * ✅ Get Order Status Timeline
   */
  @ApiOperation({ summary: 'Get order status timeline' })
  @RequirePermissions(Permission.ORDER_TRACKING_READ)
  @Get(':orderId/timeline')
  getTimeline(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.trackingService.getOrderTimeline(orderId);
  }

  /**
   * ✅ Get Order Status Statistics
   */
  @ApiOperation({ summary: 'Get order status statistics' })
  @RequirePermissions(Permission.ORDER_TRACKING_READ)
  @Get('stats/status')
  getStatusStats(@Req() req: Request) {
    return this.trackingService.getStatusStats(req);
  }
}
