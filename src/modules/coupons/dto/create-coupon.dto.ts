import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateCouponDto {
  @ApiProperty({
    example: 'WELCOME10',
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
    example: 10,
  })
  @IsNumber()
  @Min(0)
  discount_value: number;

  @ApiProperty({
    example: 500,
  })
  @IsNumber()
  @Min(0)
  minimum_order_amount: number;

  @ApiProperty({
    example: '2026-07-01T00:00:00Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    example: '2026-07-31T23:59:59Z',
  })
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  @Min(1)
  usage_limit: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_active: boolean;
}

export class CouponResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({
    enum: DiscountType,
  })
  discount_type: DiscountType;

  @ApiProperty()
  discount_value: number;

  @ApiProperty()
  minimum_order_amount: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  usage_limit: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
