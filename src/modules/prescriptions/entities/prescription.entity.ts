import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('prescriptions')
@Index(['user_id'])
@Index(['status'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        USER RELATION
  ========================= */

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /* =========================
        PRESCRIPTION DETAILS
  ========================= */

  @Column({ type: 'text' })
  image_url: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.PENDING,
  })
  status: PrescriptionStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  admin_note?: string;

  /* =========================
        TIMESTAMPS
  ========================= */

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
