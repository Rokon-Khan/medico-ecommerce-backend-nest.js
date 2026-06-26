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

@Entity('carts')
@Index('IDX_CART_USER', ['user_id'], { unique: true })
export class Cart {
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
