import { DataAccessConfig } from './types';
import db from '../_libs/db/DB';
import { classMembers } from '../_libs/db/schema';

export type InsertClassMemberInput = typeof classMembers._.inferInsert;

export const insertClassMember = async (
    input: InsertClassMemberInput,
    config: DataAccessConfig<'classMembers'> = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(classMembers)
        .values(input)
        .returning();
};

export const findMemberClasses = async (
    userId: string,
    config: DataAccessConfig<'classMembers'> = {},
) => {
    return await (config.tx ? config.tx : db).query.classMembers.findMany({
        where: (classMembers, { eq }) => eq(classMembers.userId, userId),
        with: {
            class: {
                with: {
                    thumbnail: true,
                },
            },
        },
        orderBy(fields, operators) {
            return operators.asc(fields.joinedAt);
        },
    });
};
