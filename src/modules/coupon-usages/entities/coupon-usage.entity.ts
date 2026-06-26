import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Coupon } from 'src/modules/coupons/entities/coupon.entity';

@Entity('coupon_usages')
@Index(['coupon_id'])
@Index(['user_id'])
@Index(['order_id'])
@Index(['used_at'])
export class CouponUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  coupon_id: string;

  @ManyToOne(() => Coupon, (coupon) => coupon.usages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount_amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  order_total: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata: any;

  @CreateDateColumn()
  used_at: Date;
}
