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

import { WishlistsService } from './wishlists.service';
import {
  CreateWishlistDto,
  WishlistResponseDto,
} from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiDoc({
    summary: 'Create Wishlist',
    description:
      'Adds a product to the user wishlist. Requires proper permission.',
    response: WishlistResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WISHLIST_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(req, createWishlistDto);
  }

  @ApiDoc({
    summary: 'Get All Wishlists',
    description: 'Retrieves all wishlist entries.',
    response: WishlistResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WISHLIST_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get()
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.wishlistsService.findAll(req, query);
  }

  @ApiDoc({
    summary: 'Get Wishlist',
    description: 'Retrieve a wishlist entry by UUID.',
    response: WishlistResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WISHLIST_READ)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get(':id')
  async findOne(req: Request, id: string) {
    return this.wishlistsService.findOne(req, id);
  }

  @ApiDoc({
    summary: 'Update Wishlist',
    description: 'Updates a wishlist entry.',
    response: WishlistResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WISHLIST_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(req, id, updateWishlistDto);
  }

  @ApiDoc({
    summary: 'Delete Wishlist',
    description: 'Removes a product from wishlist.',
    response: WishlistResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WISHLIST_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.wishlistsService.remove(req, id);
  }
}
