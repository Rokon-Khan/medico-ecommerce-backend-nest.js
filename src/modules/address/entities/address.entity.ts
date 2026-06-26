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

@Entity('addresses')
@Index('IDX_ADDRESS_USER', ['user_id'])
@Index('IDX_ADDRESS_PHONE', ['phone'])
@Index('IDX_ADDRESS_EMAIL', ['email'])
@Index('IDX_ADDRESS_USER_DEFAULT', ['user_id', 'is_default'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        Address Information
     ========================= */

  @Column({
    type: 'varchar',
    length: 255,
  })
  full_name: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  division: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  district: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  area: string;

  @Column({
    type: 'text',
  })
  address: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_default: boolean;

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
