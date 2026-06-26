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

import { AddressService } from './address.service';
import { CreateAddressDto, AddressResponseDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';

import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiDoc({
    summary: 'Create Address',
    description:
      'Creates a new address for a user. Requires proper permission.',
    response: AddressResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ADDRESS_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(@Req() req: Request, @Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(req, createAddressDto);
  }

  @ApiDoc({
    summary: 'Get all addresses',
    description: 'Retrieves all addresses. Supports pagination and filters.',
    response: AddressResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.addressService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single address',
    description: 'Retrieve a single address by its UUID.',
    response: AddressResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.addressService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update address',
    description: 'Updates an existing address. Requires proper permission.',
    response: AddressResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ADDRESS_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(req, id, updateAddressDto);
  }

  @ApiDoc({
    summary: 'Delete address',
    description: 'Hard deletes an address. Requires proper permission.',
    response: AddressResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.ADDRESS_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.addressService.remove(req, id);
  }
}
