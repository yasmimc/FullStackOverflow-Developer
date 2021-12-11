import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const config: pg.PoolConfig =
    process.env.NODE_ENV === 'test'
        ? {
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              database: process.env.DB_NAME,
          }
        : {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false,
              },
          };

const connection: pg.Pool = new Pool(config);

console.log(config);

export default connection;
