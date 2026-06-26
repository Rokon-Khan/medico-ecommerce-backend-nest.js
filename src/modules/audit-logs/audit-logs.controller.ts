// src/modules/audit-logs/audit-logs.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { AuditLogsService } from './audit-logs.service';

import {
  AuditLogFilterDto,
  CreateAuditLogDto,
} from './dto/create-audit-log.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { AuditEntityType } from './entities/audit-log.entity';

@Controller('audit-logs')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * ✅ GET ALL AUDIT LOGS (Admin only)
   */
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: AuditLogFilterDto) {
    return this.auditLogsService.findAll(req, query);
  }

  /**
   * ✅ GET USER AUDIT LOGS
   */
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @Get('user/:userId')
  getUserAuditLogs(
    @Req() req: Request,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: AuditLogFilterDto,
  ) {
    return this.auditLogsService.getUserAuditLogs(req, userId, query);
  }

  /**
   * ✅ GET ENTITY AUDIT LOGS (Admin only)
   */
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @Get('entity/:entityName/:entityId')
  getEntityAuditLogs(
    @Req() req: Request,
    @Param('entityName') entityName: AuditEntityType,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Query() query: AuditLogFilterDto,
  ) {
    return this.auditLogsService.getEntityAuditLogs(
      req,
      entityName,
      entityId,
      query,
    );
  }

  /**
   * ✅ GET AUDIT LOG STATS (Admin only)
   */
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @Get('stats')
  getStats(@Req() req: Request) {
    return this.auditLogsService.getStats(req);
  }

  /**
   * ✅ GET SINGLE AUDIT LOG (Admin only)
   */
  @RequirePermissions(Permission.AUDIT_LOG_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.auditLogsService.findOne(req, id);
  }

  /**
   * ✅ CREATE AUDIT LOG (Internal - System use)
   * সাধারণত সিস্টেম নিজেই তৈরি করে, কিন্তু API থাকলে ব্যবহার করা যায়
   */
  @RequirePermissions(Permission.AUDIT_LOG_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateAuditLogDto) {
    return this.auditLogsService.create(dto, req);
  }

  /**
   * ✅ CLEANUP OLD AUDIT LOGS (Admin only)
   */
  @RequirePermissions(Permission.AUDIT_LOG_DELETE)
  @Delete('cleanup/:days')
  cleanup(@Req() req: Request, @Param('days') days: string) {
    return this.auditLogsService.cleanup(req, parseInt(days) || 90);
  }
}
