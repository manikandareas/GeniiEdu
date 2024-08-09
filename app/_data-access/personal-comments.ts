import db from '../_libs/db/DB';
import { assignmentPersonalComments, comments } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertAssignmentPersonalCommentInput =
    typeof assignmentPersonalComments._.inferInsert;

export type PatchAssignmentPersonalCommentInput =
    Partial<InsertAssignmentPersonalCommentInput>;

export type InsertCommentInput = typeof comments._.inferInsert;

export type PatchCommentInput = Partial<InsertCommentInput>;

export const createAssignmentPersonalComment = async (
    input: InsertAssignmentPersonalCommentInput,
    config: DataAccessConfig<'assignmentPersonalComments'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(assignmentPersonalComments)
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
        .insert(comments)
        .values(input)
        .returning();
    return response;
};
