import { eq } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertNotificationInput,
    PatchNotificationInput,
} from './types';

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
        .insert(Schema.notifications)
        .values(inputs)
        .returning();
    return res;
};

export const patchNotification = async (
    input: PatchNotificationInput,
    config: DataAccessConfig<'notifications'> = {},
) => {
    const [res] = await (config.tx ? config.tx : db)
        .update(Schema.notifications)
        .set(input)
        .where(eq(Schema.notifications.id, input.id as number))
        .returning();
    return res;
};
