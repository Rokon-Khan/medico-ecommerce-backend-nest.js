import { Cart } from 'src/modules/carts/entities/cart.entity';
import { ProductVariant } from 'src/modules/product-variants/entities/product-variant.entity';

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

@Entity('cart_items')
@Index('IDX_CART_ITEM_CART', ['cart_id'])
@Index('IDX_CART_ITEM_PRODUCT_VARIANT', ['product_variant_id'])
@Index('IDX_CART_ITEM_CART_VARIANT', ['cart_id', 'product_variant_id'], {
  unique: true,
})
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
          Cart
     ========================= */

  @Column({
    type: 'uuid',
  })
  cart_id: string;

  @ManyToOne(() => Cart, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'cart_id',
  })
  cart: Cart;

  /* =========================
        Product Variant
     ========================= */

  @Column({
    type: 'uuid',
  })
  product_variant_id: string;

  @ManyToOne(() => ProductVariant, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_variant_id',
  })
  productVariant: ProductVariant;

  /* =========================
        Cart Item Info
     ========================= */

  @Column({
    type: 'int',
    default: 1,
  })
  quantity: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  price: number;

  /* =========================
          Timestamps
     ========================= */

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date;
}
