import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * PAYMENT METHOD ENUM
 */
export enum PaymentMethod {
  COD = 'COD',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  SSLCOMMERZ = 'SSLCOMMERZ',
}

/**
 * SHIPPING ADDRESS DTO
 */
export class ShippingAddressDto {
  @ApiProperty({
    example: '123, Main Street, Bashundhara R/A, Dhaka',
    description: 'Full address line',
  })
  @IsString()
  @IsNotEmpty()
  address_line: string;

  @ApiProperty({
    example: '01712345678',
    required: false,
    description: 'Phone number for delivery',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'john@example.com',
    required: false,
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

/**
 * ORDER ITEM DTO
 */
export class OrderItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Product variant ID (UUID)',
  })
  @IsUUID()
  @IsNotEmpty()
  product_variant_id: string;

  @ApiProperty({
    example: 'Napa 500mg Paracetamol Tablet',
    description: 'Product name (snapshot)',
  })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({
    example: 'SKU-NAPA-500-01',
    description: 'SKU of the product',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 10.5,
    description: 'Unit price of the product',
  })
  @IsNumber()
  @Min(0)
  unit_price: number;

  @ApiProperty({
    example: 21.0,
    description: 'Total price (quantity × unit_price)',
  })
  @IsNumber()
  @Min(0)
  total_price: number;
}

/**
 * CREATE ORDER DTO
 */
export class CreateOrderDto {
  @ApiProperty({
    example: 'Leave at door',
    required: false,
    description: 'Additional notes for the order',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // 💳 PAYMENT METHOD
  @ApiProperty({
    example: PaymentMethod.COD,
    enum: PaymentMethod,
    description: 'Payment method for the order',
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  // 📦 ORDER ITEMS
  @ApiProperty({
    type: [OrderItemDto],
    description: 'List of items in the order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  // 🏠 SHIPPING ADDRESS (Optional - will use default if not provided)
  @ApiProperty({
    type: ShippingAddressDto,
    required: false,
    description: 'Shipping address (used if no default address exists)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address?: ShippingAddressDto;
}
