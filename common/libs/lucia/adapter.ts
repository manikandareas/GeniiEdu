import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import db from '../DB';
import { sessions, users } from '@/common/models/Schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export default adapter;
