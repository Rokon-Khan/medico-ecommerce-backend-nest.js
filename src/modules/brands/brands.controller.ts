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
import { BrandsService } from './brands.service';
import { CreateBrandDto, BrandResponseDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiDoc({
    summary: 'Create Brand',
    description: 'Creates a new brand. Requires proper permission.',
    response: BrandResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BRAND_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(req, createBrandDto);
  }

  @ApiDoc({
    summary: 'Get all brands',
    description: 'Retrieves all brands. Supports pagination and filters.',
    response: BrandResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.brandsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single brand',
    description: 'Retrieve a single brand entry by its UUID.',
    response: BrandResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.brandsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update brand',
    description: 'Updates an existing brand entry. Requires proper permission.',
    response: BrandResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BRAND_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @ApiDoc({
    summary: 'Delete brand',
    description: 'Hard deletes a brand record. Requires proper permission.',
    response: BrandResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.BRAND_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.brandsService.remove(id);
  }
}
