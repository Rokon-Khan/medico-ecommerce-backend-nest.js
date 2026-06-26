// src/modules/order-tracking/dto/update-order-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  IsNumber,
} from 'class-validator';
import { OrderStatusEnum } from '../entities/order-tracking.entity';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.CONFIRMED,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({
    required: false,
    example: 'Order confirmed by admin',
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: false,
    example: {
      tracking_number: 'TRK123456',
      courier_name: 'Sundarban Courier',
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: {
    location?: string;
    latitude?: number;
    longitude?: number;
    tracking_number?: string;
    courier_name?: string;
    estimated_delivery?: Date;
  };
}

export class BulkUpdateOrderStatusDto {
  @ApiProperty({
    type: [String],
    example: ['uuid-1', 'uuid-2', 'uuid-3'],
  })
  @IsUUID('4', { each: true })
  order_ids: string[];

  @ApiProperty({
    enum: OrderStatusEnum,
    example: OrderStatusEnum.SHIPPED,
  })
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @ApiProperty({
    required: false,
    example: 'Bulk shipping update',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class OrderTrackingFilterDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @ApiProperty({ enum: OrderStatusEnum, required: false })
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  from_date?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  to_date?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number;
}
