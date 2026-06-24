import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  /**
   * Primary key
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  /**
   * Mobile
   */
  @Column({ type: 'varchar', length: 15, nullable: false })
  mobile: string;

  /**
   * Email
   */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  /**
   * User Role (admin / user / moderator)
   */
  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string;

  @Column({ default: 0 })
  token_version: number;

  @Column({ type: 'boolean', default: false })
  has_refresh_token: boolean;


  /**
   * Is Account Verified
   */
  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  /**
   * Password
   */

  @Column({ type: 'varchar', nullable: false })
  @Exclude()
  password: string;

  /**
   * Remember Token
   */
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  remember_token?: string;

  /**
   * Division ID (FK)
   */
  @Index()
  @Column({ type: 'int', nullable: true })
  division_id?: number;

  /**
   * District ID (FK)
   */
  @Index()
  @Column({ type: 'int', nullable: true })
  district_id?: number;

  /**
   * upzela_id
   */
  @Index()
  @Column({ type: 'int', nullable: true })
  upazila_id?: number;

  /**
   * Address
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  /**
   * Created At
   */
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  /**
   * Updated At
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
