// src/modules/order-tracking/entities/order-tracking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { Order } from 'src/modules/orders/entities/order.entity';
import { User } from 'src/modules/users/entities/user.entity';

export enum OrderStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

@Entity('order_tracking')
@Index('IDX_TRACKING_ORDER', ['order_id'])
@Index('IDX_TRACKING_STATUS', ['status'])
@Index('IDX_TRACKING_CREATED', ['created_at'])
export class OrderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  // ✅ Fix: Use any type for metadata to avoid TypeScript errors
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata: any;

  @Column({ type: 'uuid', nullable: true })
  changed_by: string;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'changed_by' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
