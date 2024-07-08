import { DataAccessConfig, InsertClassMemberInput } from './types';
import db from '../libs/DB';
import { Schema } from '../models';

export const insertClassMember = async (
    input: InsertClassMemberInput,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(Schema.classMembers)
        .values(input)
        .returning();
};

export const findMemberClasses = async (
    userId: string,
    config: DataAccessConfig = {},
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
    });
};
