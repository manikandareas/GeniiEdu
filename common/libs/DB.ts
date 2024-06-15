import * as schema from '@/common/models/Schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from './Env';

const pool = new Pool({
    host: Env.DATABASE_HOST as string,
    port: Env.DATABASE_PORT as number,
    user: Env.DATABASE_USER as string,
    database: Env.DATABASE_NAME as string,
});

const db = drizzle(pool, { schema, logger: true });

export default db;
