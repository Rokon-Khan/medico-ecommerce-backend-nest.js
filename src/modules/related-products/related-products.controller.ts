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

import { RelatedProductsService } from './related-products.service';
import {
  CreateRelatedProductDto,
  RelatedProductResponseDto,
} from './dto/create-related-product.dto';
import { UpdateRelatedProductDto } from './dto/update-related-product.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('related-products')
export class RelatedProductsController {
  constructor(
    private readonly relatedProductsService: RelatedProductsService,
  ) {}

  @ApiDoc({
    summary: 'Create Related Product',
    description:
      'Creates a related product relationship. Requires proper permission.',
    response: RelatedProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.RELATED_PRODUCT_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createRelatedProductDto: CreateRelatedProductDto,
  ) {
    return this.relatedProductsService.create(req, createRelatedProductDto);
  }

  @ApiDoc({
    summary: 'Get all related products',
    description:
      'Retrieves all related product mappings. Supports pagination and filters.',
    response: RelatedProductResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.relatedProductsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single related product',
    description: 'Retrieve a related product mapping by UUID.',
    response: RelatedProductResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.relatedProductsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update related product',
    description:
      'Updates an existing related product mapping. Requires proper permission.',
    response: RelatedProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.RELATED_PRODUCT_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateRelatedProductDto: UpdateRelatedProductDto,
  ) {
    return this.relatedProductsService.update(req, id, updateRelatedProductDto);
  }

  @ApiDoc({
    summary: 'Delete related product',
    description:
      'Hard deletes a related product mapping. Requires proper permission.',
    response: RelatedProductResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.RELATED_PRODUCT_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.relatedProductsService.remove(req, id);
  }
}
