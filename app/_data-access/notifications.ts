import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { DataAccessConfig } from './types';
import { notifications } from '../_libs/db/schema';

export type InsertNotificationInput = typeof notifications._.inferInsert;

export type PatchNotificationInput = Partial<InsertNotificationInput>;

class NotificationsData {
    async create(
        input: InsertNotificationInput,
        config: DataAccessConfig<'notifications'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(notifications)
            .values(input)
            .returning()
            .then((res) => res[0]);
    }

    async createMany(
        inputs: InsertNotificationInput[],
        config: DataAccessConfig<'notifications'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(notifications)
            .values(inputs)
            .returning();
    }

    async findManyWhereUserId(
        userId: string,
        config: DataAccessConfig<'notifications'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.notifications.findMany({
            where: (user, { eq }) => eq(user.userId, userId),
            orderBy(fields, operators) {
                return operators.desc(fields.createdAt);
            },
            limit: 10,
        });
    }

    async patch(
        input: PatchNotificationInput,
        config: DataAccessConfig<'notifications'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .update(notifications)
            .set(input)
            .where(eq(notifications.id, input.id as number))
            .returning();
    }
}

const notificationsData = new NotificationsData();
export default notificationsData;
