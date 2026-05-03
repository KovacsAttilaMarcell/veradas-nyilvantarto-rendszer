import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  institutionName!: string;

  @Column()
  address!: string;

  @Column({ default: true })
  active!: boolean;
}