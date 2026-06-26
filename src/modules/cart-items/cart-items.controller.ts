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

import { CartItemsService } from './cart-items.service';
import {
  CreateCartItemDto,
  CartItemResponseDto,
} from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { GetCartItemDto } from './dto/get-cart-item.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @ApiDoc({
    summary: 'Create Cart Item',
    description: 'Adds a product variant to the cart.',
    response: CartItemResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_ITEM_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(req, createCartItemDto);
  }

  @ApiDoc({
    summary: 'Get all cart items',
    description: 'Retrieves all cart items with pagination and filters.',
    response: CartItemResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get()
  findAll(@Query() query: GetCartItemDto) {
    return this.cartItemsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get cart item',
    description: 'Retrieve a cart item by UUID.',
    response: CartItemResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.cartItemsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update cart item',
    description: 'Update quantity or price of a cart item.',
    response: CartItemResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_ITEM_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(req, id, updateCartItemDto);
  }

  @ApiDoc({
    summary: 'Delete cart item',
    description: 'Remove a cart item from the cart.',
    response: CartItemResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_ITEM_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.cartItemsService.remove(req, id);
  }
}
