import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';

class GetAddressBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by full name',
    example: 'Zamirul Kabir',
  })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by phone number',
    example: '01712345678',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Filter by email address',
    example: 'zamirul@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by division',
    example: 'Dhaka',
  })
  @IsOptional()
  @IsString()
  division?: string;

  @ApiPropertyOptional({
    description: 'Filter by district',
    example: 'Dhaka',
  })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({
    description: 'Filter by area',
    example: 'Mirpur-10',
  })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({
    description: 'Filter by address',
    example: 'House-10, Road-5, Block-C',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Filter default address',
    example: true,
  })
  @IsOptional()
  @IsBooleanString()
  is_default?: boolean;
}

export class GetAddressDto extends IntersectionType(
  GetAddressBaseDto,
  PaginationQueryDto,
) {}
