import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './Location';
import { Donor } from './Donor';

@Entity()
export class Donation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Location;

  @ManyToOne(() => Donor, { nullable: false })
  donor!: Donor;

  @Column({ type: 'date' })
  donationDate!: string;

  @Column()
  eligible!: boolean;

  @Column({ type: 'text', nullable: true })
  ineligibleReason!: string | null;

  @Column()
  doctorName!: string;

  @Column()
  directed!: boolean;

  @Column({ type: 'varchar', nullable: true })
  patientName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  patientTajNumber!: string | null;
}