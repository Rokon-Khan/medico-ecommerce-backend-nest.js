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
import { Product } from 'src/modules/products/entities/product.entity';

@Entity('reviews')
@Index(['user_id'])
@Index(['product_id'])
@Index(['rating'])
@Index(['is_approved'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
          USER
  ========================= */

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /* =========================
          PRODUCT
  ========================= */

  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /* =========================
          REVIEW
  ========================= */

  @Column({
    type: 'int',
  })
  rating: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_approved: boolean;

  /* =========================
          TIMESTAMPS
  ========================= */

  @CreateDateColumn()
  created_at: Date;
}
