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
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { GenericsService } from './generics.service';
import { CreateGenericDto, GenericResponseDto } from './dto/create-generic.dto';
import { UpdateGenericDto } from './dto/update-generic.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('generics')
export class GenericsController {
  constructor(private readonly genericsService: GenericsService) {}

  @ApiDoc({
    summary: 'Create Generic',
    description: 'Creates a new generic. Requires proper permission.',
    response: GenericResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.GENERIC_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createGenericDto: CreateGenericDto) {
    return this.genericsService.create(req, createGenericDto);
  }

  @ApiDoc({
    summary: 'Get all generics',
    description: 'Retrieves all generics. Supports pagination and filters.',
    response: GenericResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.genericsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single generic',
    description: 'Retrieve a single generic entry by its UUID.',
    response: GenericResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.genericsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update generic',
    description:
      'Updates an existing generic entry. Requires proper permission.',
    response: GenericResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.GENERIC_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body() updateGenericDto: UpdateGenericDto,
  ) {
    return this.genericsService.update(id, updateGenericDto);
  }

  @ApiDoc({
    summary: 'Delete generic',
    description: 'Hard deletes a generic record. Requires proper permission.',
    response: GenericResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.GENERIC_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.genericsService.remove(id);
  }
}
