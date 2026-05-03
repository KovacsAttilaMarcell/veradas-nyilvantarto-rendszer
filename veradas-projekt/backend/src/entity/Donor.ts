import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Donor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  gender!: string;

  @Column()
  citizenship!: string;

  @Column()
  birthPlace!: string;

  @Column()
  birthDate!: Date;

  @Column()
  address!: string;

  @Column()
  tajNumber!: string;
}