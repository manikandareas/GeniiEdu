import * as schema from '@/common/models/schema.model';
import { Env } from './Env';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
    // eslint-disable-next-line no-var -- only var works here
    var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === 'production') {
    pg = postgres({
        host: Env.DATABASE_HOST as string,
        port: Env.DATABASE_PORT as number,
        user: Env.DATABASE_USER as string,
        database: Env.DATABASE_NAME as string,
    });
    db = drizzle(pg, { schema });
} else {
    if (!global.db) {
        pg = postgres({
            host: Env.DATABASE_HOST as string,
            port: Env.DATABASE_PORT as number,
            user: Env.DATABASE_USER as string,
            database: Env.DATABASE_NAME as string,
        });
        global.db = drizzle(pg, { schema });
    }
    db = global.db;
}

export type TypeDB = typeof db;

export default db;
