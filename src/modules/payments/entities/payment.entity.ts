import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
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
  CANCELLED = 'cancelled',
}

@Entity('payments')
@Index(['order_id'])
@Index(['status'])
@Index(['method'])
@Index(['transaction_id'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* ── ORDER RELATION ─────────────────────────── */

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  /* ── PAYMENT DETAILS ────────────────────────── */

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  transaction_id?: string;

  /** SSLCommerz val_id returned after successful payment */
  @Column({ type: 'varchar', length: 100, nullable: true })
  val_id?: string;

  /** SSLCommerz session key used for redirect URL */
  @Column({ type: 'varchar', length: 200, nullable: true })
  session_key?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at?: Date;

  /* ── GATEWAY META ───────────────────────────── */

  /** Full raw JSON response from gateway (stored encrypted in prod) */
  @Column({ type: 'text', nullable: true })
  gateway_response?: string;

  @Column({ type: 'text', nullable: true })
  failure_reason?: string;

  /** IP address that triggered the IPN/redirect callback */
  @Column({ type: 'varchar', length: 45, nullable: true })
  callback_ip?: string;

  /* ── TIMESTAMPS ─────────────────────────────── */

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
