import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('banners')
@Index(['position'])
@Index(['is_active'])
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* =========================
        BANNER DETAILS
  ========================= */

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'text',
  })
  image_url: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  redirect_url?: string;

  @Column({
    type: 'int',
    default: 1,
  })
  position: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'uuid',
  })
  added_by: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  /* =========================
        TIMESTAMPS
  ========================= */

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
