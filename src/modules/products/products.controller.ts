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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto, ProductResponseDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiDoc({
    summary: 'Create Product',
    description:
      'Creates a new product with an optional thumbnail. Requires proper permission.',
    response: ProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.create(req, createProductDto, file);
  }

  @ApiDoc({
    summary: 'Get all products',
    description: 'Retrieves all products. Supports pagination and filters.',
    response: ProductResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single product',
    description: 'Retrieve a single product entry by its UUID.',
    response: ProductResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update product',
    description:
      'Updates an existing product entry. Requires proper permission.',
    response: ProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(req, id, updateProductDto, file);
  }

  @ApiDoc({
    summary: 'Delete product',
    description: 'Hard deletes a product record. Requires proper permission.',
    response: ProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productsService.remove(req, id);
  }
}
