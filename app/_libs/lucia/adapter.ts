import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '@/app/_libs/db/DB';
import { sessions, users } from '@/app/_libs/db/schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export default adapter;
