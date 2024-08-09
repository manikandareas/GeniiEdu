import db from '../libs/DB';
import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertAssignmentPersonalCommentInput,
    InsertCommentInput,
} from './types';

export const createAssignmentPersonalComment = async (
    input: InsertAssignmentPersonalCommentInput,
    config: DataAccessConfig<'assignmentPersonalComments'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(Schema.assignmentPersonalComments)
        .values(input)
        .returning();

    return response;
};

type FindAssignmentPersonalCommentsProps = {
    assignmentId: string;
    studentId: string;
};
export const findAssignmentPersonalComments = async (
    properties: FindAssignmentPersonalCommentsProps,
    config: DataAccessConfig<'assignmentPersonalComments'> = {},
) => {
    return await (
        config.tx ? config.tx : db
    ).query.assignmentPersonalComments.findFirst({
        where: (chat, { eq, and }) =>
            and(
                eq(chat.assignmentId, properties.assignmentId),
                eq(chat.studentId, properties.studentId),
            ),
        with: {
            messages: true,
        },
    });
};

export const insertPersonalComment = async (
    input: InsertCommentInput,
    config: DataAccessConfig<'comments'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(Schema.comments)
        .values(input)
        .returning();
    return response;
};
