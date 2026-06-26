import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

import type { Request } from 'express';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { Throttle } from '@nestjs/throttler';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create Order
   */
  @ApiDoc({
    summary: 'Create Order',
    description: 'Creates a new order from cart items.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req, createOrderDto);
  }

  /**
   * Get all orders
   */
  @ApiDoc({
    summary: 'Get all orders',
    description: 'Retrieves all orders (admin sees all, user sees own).',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.ordersService.findAll(req, query);
  }

  /**
   * Get single order
   */
  @ApiDoc({
    summary: 'Get single order',
    description: 'Retrieve order by ID.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(req, id);
  }

  /**
   * Update order
   */
  @ApiDoc({
    summary: 'Update order',
    description: 'Update order status/payment/notes.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(req, id, updateOrderDto);
  }

  /**
   * Delete order
   */
  @ApiDoc({
    summary: 'Delete order',
    description: 'Delete an order (admin only).',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(req, id);
  }
}
