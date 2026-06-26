import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { DiscountType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Unique coupon code',
  })
  @IsString()
  code: string;

  @ApiProperty({
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @ApiProperty({
    example: 20,
    description: 'Discount value (percentage or fixed amount)',
  })
  @IsNumber()
  @Min(0)
  discount_value: number;

  @ApiProperty({
    example: 500,
    required: false,
    description: 'Minimum order amount required',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minimum_order_amount?: number;

  @ApiProperty({
    example: 1000,
    required: false,
    description: 'Maximum discount amount (for percentage discounts)',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maximum_discount_amount?: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({
    example: 100,
    default: 1,
    description: 'Total usage limit',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  usage_limit?: number;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Usage limit per user',
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  per_user_limit?: number;

  @ApiProperty({
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: 'Get 20% off on all medicines',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: ['product-id-1', 'product-id-2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  applicable_products?: string[];

  @ApiProperty({
    example: ['category-id-1', 'category-id-2'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  applicable_categories?: string[];

  @ApiProperty({
    example: ['product-id-3'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  excluded_products?: string[];

  @ApiProperty({
    example: ['category-id-3'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  excluded_categories?: string[];

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_first_order_only?: boolean;

  @ApiProperty({
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_combinable?: boolean;
}

export class CouponResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ enum: DiscountType })
  discount_type: DiscountType;

  @ApiProperty()
  discount_value: number;

  @ApiProperty({ required: false })
  minimum_order_amount?: number;

  @ApiProperty({ required: false })
  maximum_discount_amount?: number;

  @ApiProperty({ required: false })
  start_date?: Date;

  @ApiProperty({ required: false })
  end_date?: Date;

  @ApiProperty()
  usage_limit: number;

  @ApiProperty()
  used_count: number;

  @ApiProperty()
  per_user_limit: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  applicable_products?: string[];

  @ApiProperty({ required: false })
  applicable_categories?: string[];

  @ApiProperty({ required: false })
  excluded_products?: string[];

  @ApiProperty({ required: false })
  excluded_categories?: string[];

  @ApiProperty()
  is_first_order_only: boolean;

  @ApiProperty()
  is_combinable: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ required: false })
  remaining_uses?: number;

  @ApiProperty({ required: false })
  is_expired?: boolean;

  @ApiProperty({ required: false })
  is_valid?: boolean;
}
