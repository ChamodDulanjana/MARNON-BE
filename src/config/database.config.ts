import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Function to create the database if it doesn't exist
async function createDatabaseIfNotExists() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await dataSource.initialize();
    await dataSource.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`,
    );
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await dataSource.destroy();
  }
}

export async function getTypeOrmConfig(): Promise<TypeOrmModuleOptions> {
  await createDatabaseIfNotExists();

  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // More flexible entity loading
    synchronize: true,
    logging: true,
  };
}
