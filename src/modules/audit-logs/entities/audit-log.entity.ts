// src/modules/audit-logs/entities/audit-log.entity.ts
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

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SOFT_DELETE = 'SOFT_DELETE',
  RESTORE = 'RESTORE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  BULK_OPERATION = 'BULK_OPERATION',
}

export enum AuditEntityType {
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  REVIEW = 'REVIEW',
  COUPON = 'COUPON',
  COUPON_USAGE = 'COUPON_USAGE',
  PRESCRIPTION = 'PRESCRIPTION',
  BANNER = 'BANNER',
  SLIDER = 'SLIDER',
  ADDRESS = 'ADDRESS',
  CART = 'CART',
  WISHLIST = 'WISHLIST',
  SETTINGS = 'SETTINGS',
}

@Entity('audit_logs')
@Index(['user_id'])
@Index(['entity_name'])
@Index(['entity_id'])
@Index(['action'])
@Index(['created_at'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntityType,
  })
  entity_name: AuditEntityType;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  entity_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  old_data: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  new_data: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  changes: {
    field: string;
    old_value: any;
    new_value: any;
  }[];

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  ip_address: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  user_agent: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata: any;

  @CreateDateColumn()
  created_at: Date;
}
