import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({
    example: 'SUMMER2024',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 1000,
    description: 'Current cart total',
  })
  @IsNumber()
  order_total: number;

  @ApiProperty({
    example: ['product-id-1', 'product-id-2'],
    required: false,
  })
  @IsOptional()
  product_ids?: string[];

  @ApiProperty({
    example: 'user-id',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  is_first_order?: boolean;
}

export class ApplyCouponDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsUUID()
  order_id: string;

  @ApiProperty()
  @IsNumber()
  order_total: number;
}
