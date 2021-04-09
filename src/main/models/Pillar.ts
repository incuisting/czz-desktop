import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Pillar')
export class Pillar {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  ip?: string;

  @Column()
  name?: string;

  @Column()
  port?: string;
  // 0 offline 1up 2down
  @Column()
  status?: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;
}
