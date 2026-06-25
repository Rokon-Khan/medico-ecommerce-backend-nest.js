import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_variants')
@Index('IDX_PRODUCT_VARIANTS_SKU', ['sku'], {
  unique: true,
})
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  strength: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  pack_size: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  sku: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discount_price?: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  weight?: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  expiry_date?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  /* =========================
        Relations
     ========================= */

  @Column({
    type: 'uuid',
  })
  product_id: string;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

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

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;
}
