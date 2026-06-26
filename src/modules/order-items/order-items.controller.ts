import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { OrderItemsService } from './order-items.service';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import { GetOrderItemDto } from './dto/get-order-item.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  /**
   * GET ALL ORDER ITEMS (ADMIN ONLY)
   */
  @ApiDoc({
    summary: 'Get all order items',
    description: 'Admin can view all order items.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: GetOrderItemDto) {
    return this.orderItemsService.findAll(query);
  }

  /**
   * GET SINGLE ORDER ITEM
   */
  @ApiDoc({
    summary: 'Get single order item',
    description: 'Retrieve order item by ID.',
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ORDER_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.orderItemsService.findOne(id);
  }
}
