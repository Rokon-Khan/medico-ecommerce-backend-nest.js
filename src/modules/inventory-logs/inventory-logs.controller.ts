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

import { InventoryLogsService } from './inventory-logs.service';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { UpdateInventoryLogDto } from './dto/update-inventory-log.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('inventory-logs')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class InventoryLogsController {
  constructor(private readonly inventoryLogsService: InventoryLogsService) {}

  /**
   * CREATE INVENTORY LOG
   */
  @RequirePermissions(Permission.INVENTORY_LOG_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateInventoryLogDto) {
    return this.inventoryLogsService.create(req, dto);
  }

  /**
   * GET ALL INVENTORY LOGS
   */
  @RequirePermissions(Permission.INVENTORY_LOG_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.inventoryLogsService.findAll(req, query);
  }

  /**
   * GET SINGLE INVENTORY LOG
   */
  @RequirePermissions(Permission.INVENTORY_LOG_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryLogsService.findOne(req, id);
  }

  /**
   * UPDATE INVENTORY LOG
   */
  @RequirePermissions(Permission.INVENTORY_LOG_UPDATE)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInventoryLogDto,
  ) {
    return this.inventoryLogsService.update(req, id, dto);
  }

  /**
   * DELETE INVENTORY LOG
   */
  @RequirePermissions(Permission.INVENTORY_LOG_DELETE)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryLogsService.remove(req, id);
  }
}
