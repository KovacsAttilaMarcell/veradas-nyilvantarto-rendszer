import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Location } from './entity/Location';
import { Donor } from './entity/Donor';
import { Donation } from './entity/Donation';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'veradas_db',
  synchronize: true,
  logging: false,
  entities: [Location, Donor, Donation, User],
  migrations: [],
  subscribers: [],
});