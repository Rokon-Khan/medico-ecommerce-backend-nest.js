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

import { ProductDetailsService } from './product-details.service';
import {
  CreateProductDetailDto,
  ProductDetailResponseDto,
} from './dto/create-product-detail.dto';
import { UpdateProductDetailDto } from './dto/update-product-detail.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('product-details')
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @ApiDoc({
    summary: 'Create Product Detail',
    description:
      'Creates a new product detail record. Requires proper permission.',
    response: ProductDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_DETAIL_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createProductDetailDto: CreateProductDetailDto,
  ) {
    return this.productDetailsService.create(req, createProductDetailDto);
  }

  @ApiDoc({
    summary: 'Get all product details',
    description:
      'Retrieves all product details. Supports pagination and filters.',
    response: ProductDetailResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.productDetailsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single product detail',
    description: 'Retrieve a single product detail entry by its UUID.',
    response: ProductDetailResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productDetailsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update product detail',
    description:
      'Updates an existing product detail entry. Requires proper permission.',
    response: ProductDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_DETAIL_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateProductDetailDto: UpdateProductDetailDto,
  ) {
    return this.productDetailsService.update(req, id, updateProductDetailDto);
  }

  @ApiDoc({
    summary: 'Delete product detail',
    description:
      'Hard deletes a product detail record. Requires proper permission.',
    response: ProductDetailResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_DETAIL_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productDetailsService.remove(req, id);
  }
}
