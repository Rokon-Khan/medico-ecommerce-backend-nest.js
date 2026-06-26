// src/modules/order-tracking/dto/order-tracking-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../entities/order-tracking.entity';

export class OrderTrackingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty({ enum: OrderStatusEnum })
  status: OrderStatusEnum;

  @ApiProperty({ required: false })
  note?: string;

  @ApiProperty({ required: false })
  metadata?: any;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ required: false })
  user?: {
    id: string;
    name?: string; // ✅ Make name optional
  };
}

export class OrderTrackingDetailResponseDto {
  @ApiProperty()
  order_id: string;

  @ApiProperty()
  order_number: string;

  @ApiProperty({ enum: OrderStatusEnum })
  current_status: OrderStatusEnum;

  @ApiProperty()
  order_date: Date;

  @ApiProperty({ required: false })
  placed_at?: Date;

  @ApiProperty({ required: false })
  confirmed_at?: Date;

  @ApiProperty({ required: false })
  processed_at?: Date;

  @ApiProperty({ required: false })
  shipped_at?: Date;

  @ApiProperty({ required: false })
  delivered_at?: Date;

  @ApiProperty({ required: false })
  cancelled_at?: Date;

  @ApiProperty({ required: false })
  estimated_delivery?: Date;

  @ApiProperty({ type: [OrderTrackingResponseDto] })
  tracking_history: OrderTrackingResponseDto[];

  @ApiProperty()
  total_updates: number;

  @ApiProperty()
  last_update: Date;

  @ApiProperty({ required: false })
  progress_percentage?: number;

  @ApiProperty({ required: false })
  status_flow?: {
    current_step: number;
    total_steps: number;
    steps: {
      status: OrderStatusEnum;
      label: string;
      completed: boolean;
      timestamp?: Date;
    }[];
  };
}
