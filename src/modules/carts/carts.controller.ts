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
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

import { CartsService } from './carts.service';
import { CreateCartDto, CartResponseDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiDoc({
    summary: 'Create Cart',
    description: 'Creates a new cart. Requires proper permission.',
    response: CartResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(req, createCartDto);
  }

  @ApiDoc({
    summary: 'Get all carts',
    description: 'Retrieves all carts. Supports pagination and filters.',
    response: CartResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.cartsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single cart',
    description: 'Retrieve a single cart by UUID.',
    response: CartResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.cartsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update cart',
    description: 'Updates an existing cart.',
    response: CartResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartsService.update(req, id, updateCartDto);
  }

  @ApiDoc({
    summary: 'Delete cart',
    description: 'Deletes a cart.',
    response: CartResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.CART_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.cartsService.remove(req, id);
  }
}
