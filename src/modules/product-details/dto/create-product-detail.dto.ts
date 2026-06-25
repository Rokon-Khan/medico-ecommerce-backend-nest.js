import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDetailDto {
  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({
    description: 'Product description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Indication',
    required: false,
  })
  @IsOptional()
  @IsString()
  indication?: string;

  @ApiProperty({
    description: 'Dosage',
    required: false,
  })
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiProperty({
    description: 'Side effects',
    required: false,
  })
  @IsOptional()
  @IsString()
  side_effects?: string;

  @ApiProperty({
    description: 'Contraindication',
    required: false,
  })
  @IsOptional()
  @IsString()
  contraindication?: string;

  @ApiProperty({
    description: 'Storage instructions',
    required: false,
  })
  @IsOptional()
  @IsString()
  storage?: string;
}

export class ProductDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty({
    required: false,
  })
  description?: string;

  @ApiProperty({
    required: false,
  })
  indication?: string;

  @ApiProperty({
    required: false,
  })
  dosage?: string;

  @ApiProperty({
    required: false,
  })
  side_effects?: string;

  @ApiProperty({
    required: false,
  })
  contraindication?: string;

  @ApiProperty({
    required: false,
  })
  storage?: string;

  @ApiProperty({
    required: false,
    type: Object,
  })
  product?: {
    id: string;
    name: string;
    slug: string;
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

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
