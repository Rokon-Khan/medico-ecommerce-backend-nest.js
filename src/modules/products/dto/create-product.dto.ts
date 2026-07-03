import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'uuid-category-id',
  })
  @IsUUID()
  category_id: string;

  @ApiProperty({
    example: 'uuid-generic-id',
  })
  @IsUUID()
  generic_id: string;

  @ApiProperty({
    example: 'uuid-brand-id',
  })
  @IsUUID()
  brand_id: string;

  @ApiProperty({
    example: 'Napa Extra',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'napa-extra',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'https://cdn.site.com/products/napa.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_prescription_required: boolean;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    example: 'Beximco Pharmaceuticals Ltd.',
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty({
    example: 'Napa Extra Tablet',
    required: false,
  })
  @IsOptional()
  @IsString()
  meta_title?: string;

  @ApiProperty({
    example: 'Buy Napa Extra Tablet Online',
    required: false,
  })
  @IsOptional()
  @IsString()
  meta_keywords?: string;

  @ApiProperty({
    example: 'Napa Extra is used for pain relief and fever reduction.',
    required: false,
  })
  @IsOptional()
  @IsString()
  meta_description?: string;
}

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product UUID',
  })
  id: string;

  @ApiProperty({
    description: 'Product Category ID',
  })
  category_id: string;

  @ApiProperty({
    description: 'Generic ID',
  })
  generic_id: string;

  @ApiProperty({
    description: 'Brand ID',
  })
  brand_id: string;

  @ApiProperty({
    description: 'Product Name',
  })
  name: string;

  @ApiProperty({
    description: 'Product Slug',
  })
  slug: string;

  @ApiProperty({
    description: 'Product Thumbnail URL',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Whether prescription is required',
  })
  is_prescription_required: boolean;

  @ApiProperty({
    description: 'Product Active Status',
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Manufacturer Name',
    required: false,
  })
  manufacturer?: string;

  @ApiProperty({
    description: 'Meta Title',
    required: false,
  })
  meta_title?: string;

  @ApiProperty({
    description: 'Meta Keywords',
    required: false,
  })
  meta_keywords?: string;

  @ApiProperty({
    description: 'Meta Description',
    required: false,
  })
  meta_description?: string;

  @ApiProperty({
    description: 'Category information',
    required: false,
    type: Object,
  })
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'Generic information',
    required: false,
    type: Object,
  })
  generic?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Brand information',
    required: false,
    type: Object,
  })
  brand?: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'User who created this product',
    required: false,
    type: Object,
  })
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };

  @ApiProperty({
    description: 'Created At',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Updated At',
  })
  updated_at: Date;
}
