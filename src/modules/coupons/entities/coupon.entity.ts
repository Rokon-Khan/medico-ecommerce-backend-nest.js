import { CouponUsage } from 'src/modules/coupon-usages/entities/coupon-usage.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('coupons')
@Index(['code'])
@Index(['is_active'])
@Index(['start_date', 'end_date'])
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: DiscountType,
    default: DiscountType.PERCENTAGE,
  })
  discount_type: DiscountType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount_value: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minimum_order_amount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maximum_discount_amount: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  start_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  end_date: Date;

  @Column({
    type: 'int',
    default: 1,
  })
  usage_limit: number;

  @Column({
    type: 'int',
    default: 0,
  })
  used_count: number;

  @Column({
    type: 'int',
    default: 1,
  })
  per_user_limit: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  applicable_products: string[]; // Product IDs

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  applicable_categories: string[]; // Category IDs

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  excluded_products: string[]; // Product IDs

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  excluded_categories: string[]; // Category IDs

  @Column({
    type: 'boolean',
    default: false,
  })
  is_first_order_only: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_combinable: boolean;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  added_by: string;
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  usages: CouponUsage[];
}
