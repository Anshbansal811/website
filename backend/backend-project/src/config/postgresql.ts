import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const connectPostgres = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
};

export const disconnectPostgres = async () => {
  await client.end();
  console.log('Disconnected from PostgreSQL database');
};