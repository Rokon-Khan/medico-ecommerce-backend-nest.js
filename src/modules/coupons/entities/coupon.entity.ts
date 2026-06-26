import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

@Entity('coupons')
@Index(['code'], { unique: true })
@Index(['is_active'])
@Index(['start_date'])
@Index(['end_date'])
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Coupon Code
   * Example: WELCOME10
   */
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  code: string;

  /**
   * Discount Type
   * PERCENTAGE / FIXED
   */
  @Column({
    type: 'enum',
    enum: DiscountType,
  })
  discount_type: DiscountType;

  /**
   * Percentage or Fixed Amount
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount_value: number;

  /**
   * Minimum Order Amount
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  minimum_order_amount: number;

  /**
   * Coupon Start Date
   */
  @Column({
    type: 'timestamp',
  })
  start_date: Date;

  /**
   * Coupon Expiry Date
   */
  @Column({
    type: 'timestamp',
  })
  end_date: Date;

  /**
   * Maximum Usage Count
   */
  @Column({
    type: 'int',
    default: 1,
  })
  usage_limit: number;

  /**
   * Current Usage Count
   */
  @Column({
    type: 'int',
    default: 0,
  })
  used_count: number;

  /**
   * Active Status
   */
  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  /**
   * Created At
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * Updated At
   */
  @UpdateDateColumn()
  updated_at: Date;
}
