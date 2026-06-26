import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';

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

@Entity('wishlists')
@Index('IDX_WISHLIST_USER', ['user_id'])
@Index('IDX_WISHLIST_PRODUCT', ['product_id'])
@Index('IDX_WISHLIST_USER_PRODUCT', ['user_id', 'product_id'], {
  unique: true,
})
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
            User
     ========================= */

  @Column({
    type: 'uuid',
  })
  user_id: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  /* =========================
          Product
     ========================= */

  @Column({
    type: 'uuid',
  })
  product_id: string;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

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
