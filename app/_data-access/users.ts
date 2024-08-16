import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { users } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertUserInput = typeof users._.inferInsert;

export type SelectUser = typeof users._.inferSelect;

export type PatchUserInput = Partial<SelectUser>;

class UsersData {
    create(input: InsertUserInput, config: DataAccessConfig<'users'> = {}) {
        return (config.tx ? config.tx : db)
            .insert(users)
            .values(input)
            .returning();
    }

    patch(input: PatchUserInput, config: DataAccessConfig<'users'> = {}) {
        return (config.tx ? config.tx : db)
            .update(users)
            .set(input)
            .where(eq(users.id, input.id as string))
            .returning();
    }

    findByEmail = async (
        email: string,
        config: DataAccessConfig<'users'> = {},
    ) => {
        return await (config.tx ? config.tx : db).query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });
    };

    findById = async (id: string, config: DataAccessConfig<'users'> = {}) => {
        return await (config.tx ? config.tx : db).query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
        });
    };
}

const usersData = new UsersData();
export default usersData;
