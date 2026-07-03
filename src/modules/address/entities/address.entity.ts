// address.entity.ts - CORRECT VERSION
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Order } from 'src/modules/orders/entities/order.entity';

@Entity('addresses')
@Index('IDX_ADDRESS_USER', ['user_id'])
@Index('IDX_ADDRESS_PHONE', ['phone'])
@Index('IDX_ADDRESS_EMAIL', ['email'])
@Index('IDX_ADDRESS_USER_DEFAULT', ['user_id', 'is_default'])
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        User
  ========================= */
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /* =========================
        Address Fields - ALL IN ONE
  ========================= */

  // Full name of the recipient
  @Column({ type: 'varchar', length: 100, nullable: true })
  full_name: string;

  // Phone number
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  // Email address
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  // Area/Location
  @Column({ type: 'varchar', length: 100, nullable: true })
  area: string;

  // Division/State
  @Column({ type: 'varchar', length: 100, nullable: true })
  division: string;

  // District/City
  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string;

  // Full address line
  @Column({ type: 'varchar', length: 255 })
  address: string;

  // City
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  // State/Division
  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  // Postal/Zip code
  @Column({ type: 'varchar', length: 20, nullable: true })
  zip: string;

  // Country
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  // Name (alias for full_name)
  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  // Is default address
  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  /* =========================
        Relations
  ========================= */
  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  /* =========================
        Timestamps
  ========================= */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
