import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';

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

  @ApiProperty()
  placed_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
