
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
import { WhoWeAreService } from './who-we-are.service';
import {
  CreateWhoWeAreDto,
  WhoWeAreResponseDto,
} from './dto/create-who-we-are.dto';
import { UpdateWhoWeAreDto } from './dto/update-who-we-are.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('who-we-are')
export class WhoWeAreController {
  constructor(private readonly whoWeAreService: WhoWeAreService) {}

  @ApiDoc({
    summary: 'Create Who We Are Entry',
    description: 'Creates a new Who We Are entry. Requires proper permission.',
    response: WhoWeAreResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_CREATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post('create')
  create(
    @Req() req: Request,
    @Body() createWhoWeAreDto: CreateWhoWeAreDto,
    @UploadedFile() file?: Express.Multer.File, // 👈 This will now resolve perfectly
  ) {
    return this.whoWeAreService.create(req, createWhoWeAreDto, file);
  }

  @ApiDoc({
    summary: 'Get all Who We Are entries',
    description:
      'Retrieves all Who We Are entries. Supports pagination and filters.',
    response: WhoWeAreResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: any) {
    return this.whoWeAreService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get single Who We Are entry',
    description: 'Retrieve a single Who We Are entry by UUID.',
    response: WhoWeAreResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(JwtOrApiKeyGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.whoWeAreService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Who We Are entry',
    description:
      'Updates an existing Who We Are entry. Requires proper permission.',
    response: WhoWeAreResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_UPDATE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWhoWeAreDto: UpdateWhoWeAreDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.whoWeAreService.update(id, updateWhoWeAreDto, file);
  }

  @ApiDoc({
    summary: 'Delete Who We Are entry',
    description: 'Soft deletes a Who We Are entry. Requires proper permission.',
    response: WhoWeAreResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermissions(Permission.WHO_WE_ARE_DELETE)
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.whoWeAreService.remove(id);
  }
}
