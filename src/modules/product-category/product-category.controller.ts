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
import { ProductCategoryService } from './product-category.service';
import {
  CreateProductCategoryDto,
  ProductCategoryResponseDto,
} from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiDoc({
    summary: 'Create Product Category',
    description:
      'Creates a new product category with an optional display image. Requires proper permission.',
    response: ProductCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_CATEGORY_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productCategoryService.create(
      req,
      createProductCategoryDto,
      file,
    );
  }

  @ApiDoc({
    summary: 'Get all product categories',
    description:
      'Retrieves all product categories. Supports pagination and filters.',
    response: ProductCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.productCategoryService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single product category',
    description: 'Retrieve a single product category entry by its UUID.',
    response: ProductCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update product category',
    description:
      'Updates an existing product category entry. Requires proper permission.',
    response: ProductCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_CATEGORY_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productCategoryService.update(
      req,
      id,
      updateProductCategoryDto,
      file,
    );
  }

  @ApiDoc({
    summary: 'Delete product category',
    description:
      'Hard deletes a product category record. Requires proper permission.',
    response: ProductCategoryResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.PRODUCT_CATEGORY_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.productCategoryService.remove(req, id);
  }
}
