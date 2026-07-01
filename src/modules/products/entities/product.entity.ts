import { Brand } from 'src/modules/brands/entities/brand.entity';
import { Generic } from 'src/modules/generics/entities/generic.entity';
import { ProductCategory } from 'src/modules/product-category/entities/product-category.entity';
import { ProductVariant } from 'src/modules/product-variants/entities/product-variant.entity';
import { User } from 'src/modules/users/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
@Index('IDX_PRODUCTS_NAME', ['name'])
@Index('IDX_PRODUCTS_SLUG', ['slug'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  thumbnail?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_prescription_required: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  manufacturer?: string;

  /* =========================
        Relations
     ========================= */

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => ProductCategory, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @Column({ type: 'uuid' })
  generic_id: string;
  @ManyToOne(() => Generic, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'generic_id' })
  generic: Generic;

  @Column({ type: 'uuid' })
  brand_id: string;
  @ManyToOne(() => Brand, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({
    type: 'uuid',
  })
  added_by: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  meta_title?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  meta_keywords?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  meta_description?: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;
}
