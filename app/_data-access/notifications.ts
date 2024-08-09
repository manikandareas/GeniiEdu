import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { DataAccessConfig } from './types';
import { notifications } from '../_libs/db/schema';

export type InsertNotificationInput = typeof notifications._.inferInsert;

export type PatchNotificationInput = Partial<InsertNotificationInput>;

export const findUserNotifications = async (
    userId: string,
    config: DataAccessConfig<'notifications'> = {},
) => {
    return await (config.tx ? config.tx : db).query.notifications.findMany({
        where: (user, { eq }) => eq(user.userId, userId),
        orderBy(fields, operators) {
            return operators.desc(fields.createdAt);
        },
        limit: 10,
    });
};

export const insertNotifications = async (
    inputs: InsertNotificationInput[],
    config: DataAccessConfig<'notifications'> = {},
) => {
    const [res] = await (config.tx ? config.tx : db)
        .insert(notifications)
        .values(inputs)
        .returning();
    return res;
};

export const patchNotification = async (
    input: PatchNotificationInput,
    config: DataAccessConfig<'notifications'> = {},
) => {
    const [res] = await (config.tx ? config.tx : db)
        .update(notifications)
        .set(input)
        .where(eq(notifications.id, input.id as number))
        .returning();
    return res;
};
