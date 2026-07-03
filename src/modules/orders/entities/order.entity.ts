import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { OrderItem } from 'src/modules/order-items/entities/order-item.entity';

@Entity('orders')
@Index('IDX_ORDER_USER', ['user_id'])
@Index('IDX_ORDER_STATUS', ['order_status'])
@Index('IDX_ORDER_PAYMENT_STATUS', ['payment_status'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        Order Number
     ========================= */

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  order_number: string;

  /* =========================
            User
     ========================= */

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /* =========================
          Address
     ========================= */

  @Column({ type: 'uuid' })
  address_id: string;

  @ManyToOne(() => Address, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  /* =========================
        Pricing (CALCULATED)
     ========================= */

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  delivery_charge: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total_amount: number;

  /* =========================
        Status
     ========================= */

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  payment_status: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  order_status: string;

  // ✅ ADD THIS - PAYMENT METHOD
  @Column({ type: 'varchar', length: 50, default: 'COD' })
  payment_method: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  /* =========================
            Notes
     ========================= */

  @Column({ type: 'text', nullable: true })
  notes?: string;

  /* =========================
        Placed At
     ========================= */

  @Column({ type: 'timestamp', nullable: true })
  placed_at: Date;

  /* =========================
        Timestamps
     ========================= */

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
