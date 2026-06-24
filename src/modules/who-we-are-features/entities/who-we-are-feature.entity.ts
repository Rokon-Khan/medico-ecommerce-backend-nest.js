import { User } from 'src/modules/users/entities/user.entity';
import { WhoWeAre } from 'src/modules/who-we-are/entities/who-we-are.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('who_we_are_features')
@Index('IDX_WHO_WE_ARE_FEATURE_TITLE', ['title'])
@Index('IDX_WHO_WE_ARE_FEATURE_DESCRIPTION', ['description'])
export class WhoWeAreFeature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'bigint', nullable: false })
  added_by: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @Column({ type: 'bigint', nullable: false })
  who_we_are_id: string;

  @ManyToOne(() => WhoWeAre, { nullable: false })
  @JoinColumn({ name: 'who_we_are_id' })
  whoWeAre: WhoWeAre;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date;
}
