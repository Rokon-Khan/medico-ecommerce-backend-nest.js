import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    example: '2d45f9d8-5b67-46d5-b4b2-9b7d15d27e21',
  })
  @IsUUID()
  cart_id: string;

  @ApiProperty({
    example: 'ab12cd34-5678-90ef-gh12-34567890ijkl',
  })
  @IsUUID()
  product_variant_id: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 120.5,
    description: 'Unit price at the time of adding to cart',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;
}

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart Item UUID',
  })
  id: string;

  @ApiProperty({
    description: 'Cart ID',
  })
  cart_id: string;

  @ApiProperty({
    description: 'Product Variant ID',
  })
  product_variant_id: string;

  @ApiProperty({
    description: 'Quantity',
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit Price',
  })
  price: number;

  @ApiProperty({
    description: 'Cart Information',
    required: false,
    type: Object,
  })
  cart?: {
    id: string;
  };

  @ApiProperty({
    description: 'Product Variant Information',
    required: false,
    type: Object,
  })
  product_variant?: {
    id: string;
    sku: string;
    strength: string;
    pack_size: string;
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
