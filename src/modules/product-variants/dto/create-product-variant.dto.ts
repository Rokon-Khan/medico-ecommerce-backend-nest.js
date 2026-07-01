import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    example: '500mg',
  })
  @IsString()
  @IsNotEmpty()
  strength: string;

  @ApiProperty({
    example: '10 Tablets',
  })
  @IsString()
  @IsNotEmpty()
  pack_size: string;

  @ApiProperty({
    example: 'NAPA-500-10TAB',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    example: 120,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price?: number;

  @ApiProperty({
    example: 500,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 0.25,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiProperty({
    example: '2028-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiry_date?: Date;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_active: boolean;
}
export class ProductVariantResponseDto {
  @ApiProperty({
    description: 'Product Variant UUID',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
  })
  product_id: string;

  @ApiProperty({
    description: 'Strength',
  })
  strength: string;

  @ApiProperty({
    description: 'Pack Size',
  })
  pack_size: string;

  @ApiProperty({
    description: 'SKU',
  })
  sku: string;

  @ApiProperty({
    description: 'Price',
  })
  price: number;

  @ApiProperty({
    description: 'Discount Price',
    required: false,
  })
  discount_price?: number;

  @ApiProperty({
    description: 'Available Stock',
  })
  stock: number;

  @ApiProperty({
    description: 'Weight',
    required: false,
  })
  weight?: number;

  @ApiProperty({
    description: 'Expiry Date',
    required: false,
  })
  expiry_date?: Date;

  @ApiProperty({
    description: 'Active Status',
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Product Information',
    required: false,
    type: Object,
  })
  product?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'User who created this variant',
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
