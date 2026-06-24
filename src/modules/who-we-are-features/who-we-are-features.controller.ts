import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { WhoWeAreFeaturesService } from './who-we-are-features.service';
import {
  CreateWhoWeAreFeatureDto,
  WhoWeAreFeatureResponseDto,
} from './dto/create-who-we-are-feature.dto';
import { UpdateWhoWeAreFeatureDto } from './dto/update-who-we-are-feature.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

@Controller('who-we-are-features')
export class WhoWeAreFeaturesController {
  constructor(
    private readonly whoWeAreFeaturesService: WhoWeAreFeaturesService,
  ) {}

  @ApiDoc({
    summary: 'Create Who We Are Feature',
    description:
      'Creates a new Who We Are Feature. Requires proper permission.',
    response: WhoWeAreFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_FEATURE_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createWhoWeAreFeatureDto: CreateWhoWeAreFeatureDto,
  ) {
    return this.whoWeAreFeaturesService.create(req, createWhoWeAreFeatureDto);
  }

  @ApiDoc({
    summary: 'Get all Who We Are Features',
    description:
      'Retrieves all Who We Are Features with optional pagination/filters.',
    response: WhoWeAreFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.whoWeAreFeaturesService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Who We Are Feature',
    description: 'Retrieve a single Who We Are Feature by UUID.',
    response: WhoWeAreFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.whoWeAreFeaturesService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Who We Are Feature',
    description:
      'Updates an existing Who We Are Feature. Requires proper permission.',
    response: WhoWeAreFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_FEATURE_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWhoWeAreFeatureDto: UpdateWhoWeAreFeatureDto,
  ) {
    return this.whoWeAreFeaturesService.update(id, updateWhoWeAreFeatureDto);
  }

  @ApiDoc({
    summary: 'Delete Who We Are Feature',
    description:
      'Soft deletes a Who We Are Feature. Requires proper permission.',
    response: WhoWeAreFeatureResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_FEATURE_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.whoWeAreFeaturesService.remove(id);
  }
}
