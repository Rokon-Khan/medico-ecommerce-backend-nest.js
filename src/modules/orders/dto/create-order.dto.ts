import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';

/**
 * PAYMENT METHOD ENUM (BEST PRACTICE)
 */
export enum PaymentMethod {
  COD = 'COD',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  SSLCOMMERZ = 'SSLCOMMERZ',
}

export class CreateOrderDto {
  @ApiProperty({
    example: '2c9d1f0d-1a22-49df-a7e3-99c83f08b9aa',
  })
  @IsUUID()
  address_id: string;

  @ApiProperty({
    example: 'Leave at door',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // 💳 PAYMENT METHOD (NEW ADDITION)
  @ApiProperty({
    example: PaymentMethod.COD,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
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

  // 💳 NEW FIELD (IMPORTANT FOR TRACKING)
  @ApiProperty({
    example: 'COD',
  })
  payment_method: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  placed_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
