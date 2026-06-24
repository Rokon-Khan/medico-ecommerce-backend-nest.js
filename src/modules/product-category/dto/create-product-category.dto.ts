import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

/**
 * DTO for creating a Product Category entry
 */
export class CreateProductCategoryDto {
  @ApiProperty({
    description: 'Name of the product category',
    example: 'Premium Bags',
  })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({
    description: 'Optional category display banner or thumbnail image URL',
    example: 'https://example.com/categories/premium-bags.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;
}


/**
 * Response DTO for Product Category entity
 */
export class ProductCategoryResponseDto {
  @ApiProperty({ description: 'UUID of the product category entry' })
  id: string;

  @ApiProperty({ description: 'Name of the product category' })
  name: string;



  @ApiProperty({
    description: 'Category image URL',
    required: false,
  })
  image?: string;

  @ApiProperty({
    description: 'Information about the staff or admin who created this category',
    required: false,
    type: Object,
  })
  addedBy?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiProperty({
    description: 'Soft delete timestamp, if the category is deleted',
    required: false,
    example: '2026-06-24T15:30:00.000Z',
  })
  deleted_at?: Date;
}