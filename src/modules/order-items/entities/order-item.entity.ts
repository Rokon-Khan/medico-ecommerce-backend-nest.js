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
import { ProductVariant } from 'src/modules/product-variants/entities/product-variant.entity';

@Entity('order_items')
@Index(['order_id'])
@Index(['product_variant_id'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        ORDER RELATION
  ========================= */

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  /* =========================
     PRODUCT SNAPSHOT DATA
  ========================= */

  @Column({ type: 'uuid' })
  product_variant_id: string;

  @Column()
  product_name: string;

  @Column()
  sku: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  /* =========================
        RELATION (optional)
  ========================= */

  @ManyToOne(() => ProductVariant, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  /* =========================
        TIMESTAMP
  ========================= */

  @CreateDateColumn()
  created_at: Date;
}
