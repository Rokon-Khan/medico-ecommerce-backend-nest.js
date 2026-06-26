import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    example: '8d4c1f0d-0e17-49df-a7e3-43c83f08b2f2',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    example: 'b1d0d6f3-9a1d-4c56-9b1e-6b31dfe6f28d',
  })
  @IsUUID()
  product_id: string;
}

export class WishlistResponseDto {
  @ApiProperty({
    description: 'Wishlist UUID',
  })
  id: string;

  @ApiProperty({
    description: 'User UUID',
  })
  user_id: string;

  @ApiProperty({
    description: 'Product UUID',
  })
  product_id: string;

  @ApiProperty({
    description: 'User Information',
    required: false,
    type: Object,
  })
  user?: {
    id: string;
    name?: string;
    email?: string;
  };

  @ApiProperty({
    description: 'Product Information',
    required: false,
    type: Object,
  })
  product?: {
    id: string;
    name: string;
    slug: string;
    thumbnail?: string;
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
