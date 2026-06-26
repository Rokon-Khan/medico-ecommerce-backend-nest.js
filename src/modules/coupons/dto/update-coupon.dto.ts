// src/modules/coupons/dto/update-coupon.dto.ts
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

export class UpdateCouponDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ enum: DiscountType, required: false })
  @IsEnum(DiscountType)
  @IsOptional()
  discount_type?: DiscountType;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount_value?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minimum_order_amount?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maximum_discount_amount?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  usage_limit?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  per_user_limit?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  applicable_products?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  applicable_categories?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  excluded_products?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  excluded_categories?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_first_order_only?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_combinable?: boolean;
}
