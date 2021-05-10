import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Setting')
export class Setting {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('boolean', { default: false })
  isActive: boolean = false;

  @Column()
  appId?: string;

  @Column()
  expireDate?: number;

  @Column()
  lastUseTime?: number;
}
