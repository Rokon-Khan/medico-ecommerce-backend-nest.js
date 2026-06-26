// src/modules/products/dto/product-search.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductSearchDto {
  @ApiProperty({
    required: false,
    description: 'Search term for product name, brand, generic',
    example: 'paracetamol',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Category ID filter',
  })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiProperty({
    required: false,
    description: 'Generic ID filter',
  })
  @IsOptional()
  @IsUUID()
  generic_id?: string;

  @ApiProperty({
    required: false,
    description: 'Brand ID filter',
  })
  @IsOptional()
  @IsUUID()
  brand_id?: string;

  @ApiProperty({
    required: false,
    description: 'Manufacturer ID filter',
  })
  @IsOptional()
  @IsUUID()
  manufacturer_id?: string;

  @ApiProperty({
    required: false,
    description: 'Minimum price',
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_price?: number;

  @ApiProperty({
    required: false,
    description: 'Maximum price',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_price?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by prescription required',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_prescription_required?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;

  @ApiProperty({
    required: false,
    description: 'Filter by status',
    enum: ['active', 'inactive', 'draft'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    description: 'Sort by field',
    enum: ['name', 'price', 'created_at', 'rating', 'popularity'],
    default: 'created_at',
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiProperty({
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sort_order?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 20,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    required: false,
    description: 'Tags filter (comma separated)',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({
    required: false,
    description: 'Dosage form filter',
  })
  @IsOptional()
  @IsString()
  dosage_form?: string;

  @ApiProperty({
    required: false,
    description: 'Strength filter',
  })
  @IsOptional()
  @IsString()
  strength?: string;

  @ApiProperty({
    required: false,
    description: 'Category slugs filter (comma separated)',
  })
  @IsOptional()
  @IsString()
  category_slugs?: string;
}
