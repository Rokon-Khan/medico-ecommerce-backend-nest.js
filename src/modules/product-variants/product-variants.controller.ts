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

import { ProductVariantsService } from './product-variants.service';
import {
  CreateProductVariantDto,
  ProductVariantResponseDto,
} from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @ApiDoc({
    summary: 'Create Product Variant',
    description: 'Creates a new product variant. Requires proper permission.',
    response: ProductVariantResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_VARIANT_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    return this.productVariantsService.create(req, createProductVariantDto);
  }

  @ApiDoc({
    summary: 'Get all product variants',
    description:
      'Retrieves all product variants. Supports pagination and filters.',
    response: ProductVariantResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.productVariantsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single product variant',
    description: 'Retrieve a single product variant entry by its UUID.',
    response: ProductVariantResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productVariantsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update product variant',
    description:
      'Updates an existing product variant entry. Requires proper permission.',
    response: ProductVariantResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_VARIANT_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.update(req, id, updateProductVariantDto);
  }

  @ApiDoc({
    summary: 'Delete product variant',
    description:
      'Hard deletes a product variant record. Requires proper permission.',
    response: ProductVariantResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_VARIANT_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productVariantsService.remove(req, id);
  }
}
