import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { BannersService } from './banners.service';

import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { GetBannerDto } from './dto/get-banner.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('banners')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  /**
   * CREATE BANNER
   */
  @RequirePermissions(Permission.BANNER_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateBannerDto) {
    return this.bannersService.create(req, dto);
  }

  /**
   * GET ALL BANNERS
   */

  @RequirePermissions(Permission.BANNER_READ)
  @Get()
  findAll(@Query() query: GetBannerDto) {
    return this.bannersService.findAll(query);
  }

  /**
   * GET SINGLE BANNER
   */
  @RequirePermissions(Permission.BANNER_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.bannersService.findOne(req, id);
  }

  /**
   * UPDATE BANNER
   */
  @RequirePermissions(Permission.BANNER_UPDATE)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBannerDto,
  ) {
    return this.bannersService.update(req, id, dto);
  }

  /**
   * DELETE BANNER
   */
  @RequirePermissions(Permission.BANNER_DELETE)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.bannersService.remove(req, id);
  }
}
