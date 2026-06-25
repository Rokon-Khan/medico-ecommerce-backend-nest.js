import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateRelatedProductDto {
  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Main Product ID',
  })
  @IsUUID()
  product_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Related Product ID',
  })
  @IsUUID()
  related_product_id: string;
}

export class RelatedProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  related_product_id: string;

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
    required: false,
    type: Object,
  })
  relatedProduct?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty()
  created_at: Date;
}
