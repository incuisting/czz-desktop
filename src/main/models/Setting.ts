import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Setting')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column('boolean', { default: false })
  isActive: boolean = false;
}
