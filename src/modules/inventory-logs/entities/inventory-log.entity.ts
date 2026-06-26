import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { ProductVariant } from 'src/modules/product-variants/entities/product-variant.entity';

export enum InventoryLogType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('inventory_logs')
@Index(['product_variant_id'])
@Index(['type'])
@Index(['reference_id'])
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        PRODUCT VARIANT
  ========================= */

  @Column({ type: 'uuid' })
  product_variant_id: string;

  @ManyToOne(() => ProductVariant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  /* =========================
        LOG TYPE
  ========================= */

  @Column({
    type: 'enum',
    enum: InventoryLogType,
  })
  type: InventoryLogType;

  /* =========================
        STOCK CHANGE
  ========================= */

  @Column({ type: 'int' })
  quantity: number;

  /* =========================
        REFERENCE
        (Order ID, Purchase ID, Return ID, etc.)
  ========================= */

  @Column({ type: 'uuid' })
  reference_id: string;

  /* =========================
        REMARKS
  ========================= */

  @Column({
    type: 'text',
    nullable: true,
  })
  remarks?: string;

  /* =========================
        CREATED AT
  ========================= */

  @CreateDateColumn()
  created_at: Date;
}
