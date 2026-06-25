import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_details')
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    unique: true,
  })
  product_id: string;

  @OneToOne(() => Product, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  indication?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  dosage?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  side_effects?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  contraindication?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  storage?: string;

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
