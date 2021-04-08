import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
