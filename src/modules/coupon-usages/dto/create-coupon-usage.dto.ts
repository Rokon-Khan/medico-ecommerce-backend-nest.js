// src/modules/coupon-usages/dto/coupon-usage-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CouponUsageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  coupon_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  discount_amount: number;

  @ApiProperty()
  order_total: number;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty()
  used_at: Date;

  @ApiProperty({ required: false })
  coupon?: {
    id: string;
    code: string;
    discount_type: string;
    discount_value: number;
  };

  @ApiProperty({ required: false })
  user?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ required: false })
  order?: {
    id: string;
    order_number: string;
    total: number;
  };
}
