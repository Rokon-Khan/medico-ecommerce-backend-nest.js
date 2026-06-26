import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

@Controller('prescriptions')
@UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  /**
   * CREATE PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_CREATE)
  @Post()
  create(@Req() req: Request, @Body() dto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(req, dto);
  }

  /**
   * GET ALL PRESCRIPTIONS
   */
  @RequirePermissions(Permission.PRESCRIPTION_READ)
  @Get()
  findAll(@Req() req: Request, @Query() query: any) {
    return this.prescriptionsService.findAll(req, query);
  }

  /**
   * GET SINGLE PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_READ)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.findOne(req, id);
  }

  /**
   * UPDATE PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_UPDATE)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(req, id, dto);
  }

  /**
   * APPROVE PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_APPROVE)
  @Patch(':id/approve')
  approve(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.approve(req, id);
  }

  /**
   * REJECT PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_REJECT)
  @Patch(':id/reject')
  reject(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('admin_note') admin_note?: string,
  ) {
    return this.prescriptionsService.reject(req, id, admin_note);
  }

  /**
   * DELETE PRESCRIPTION
   */
  @RequirePermissions(Permission.PRESCRIPTION_DELETE)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.remove(req, id);
  }
}
