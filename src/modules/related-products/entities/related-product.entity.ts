import { Product } from 'src/modules/products/entities/product.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('related_products')
@Index('IDX_RELATED_PRODUCT_UNIQUE', ['product_id', 'related_product_id'], {
  unique: true,
})
export class RelatedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        Main Product
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

  /* =========================
        Related Product
     ========================= */

  @Column({
    type: 'uuid',
  })
  related_product_id: string;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'related_product_id' })
  relatedProduct: Product;

  /* =========================
        Timestamps
     ========================= */

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;
}
