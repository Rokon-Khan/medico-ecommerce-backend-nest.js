import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  product_variant_id: string;

  @ApiProperty()
  @IsString()
  product_name: string;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unit_price: number;

  @ApiProperty()
  @IsNumber()
  total_price: number;
}

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  product_variant_id: string;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit_price: number;

  @ApiProperty()
  total_price: number;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_number: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  address_id: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  delivery_charge: number;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  payment_status: string;

  @ApiProperty()
  order_status: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  placed_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
