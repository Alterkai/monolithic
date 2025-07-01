import { Pool } from 'pg';

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error', err);
  process.exit(-1);
});

export const db = {
  query: (text: string, params: any[] = []) => {
    return pool.query(text, params)
  },
  connect: () => {
    return pool.connect();
  },
  end: () => {
    return pool.end();
  }
}