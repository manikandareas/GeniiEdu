import type { Config } from 'drizzle-kit';

export default {
    schema: './common/models/Schema.ts',
    out: './migrations',
    dialect: 'postgresql', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        host: process.env.DATABASE_HOST ?? '',
        user: process.env.DATABASE_USER ?? '',
        database: process.env.DATABASE_NAME ?? '',
        port: Number(process.env.DATABASE_PORT ?? 0),
        ssl: false,
    },
    verbose: true,
    strict: true,
} satisfies Config;
