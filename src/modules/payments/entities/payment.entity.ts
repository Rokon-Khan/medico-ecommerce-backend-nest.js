import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';

import { Order } from 'src/modules/orders/entities/order.entity';

export enum PaymentMethod {
  COD = 'COD',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  ROCKET = 'ROCKET',
  SSLCOMMERZ = 'SSLCOMMERZ',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
@Index(['order_id'])
@Index(['status'])
@Index(['method'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        ORDER RELATION
  ========================= */

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  /* =========================
        PAYMENT DETAILS
  ========================= */

  @Column({ type: 'varchar', length: 20 })
  method: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  /* =========================
        OPTIONAL META DATA
  ========================= */

  @Column({ type: 'text', nullable: true })
  gateway_response?: string;

  @Column({ type: 'text', nullable: true })
  failure_reason?: string;

  /* =========================
        TIMESTAMPS
  ========================= */

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
