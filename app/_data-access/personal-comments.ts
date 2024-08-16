import db from '../_libs/db/DB';
import { assignmentPersonalComments, comments } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertAssignmentPersonalCommentInput =
    typeof assignmentPersonalComments._.inferInsert;

export type PatchAssignmentPersonalCommentInput =
    Partial<InsertAssignmentPersonalCommentInput>;

export type InsertCommentInput = typeof comments._.inferInsert;

export type PatchCommentInput = Partial<InsertCommentInput>;

class PersonalCommentsData {
    async create(
        input: InsertAssignmentPersonalCommentInput,
        config: DataAccessConfig<'assignmentPersonalComments'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(assignmentPersonalComments)
            .values(input)
            .returning()
            .then((res) => res[0]);
    }

    async findOne(
        properties: { assignmentId: string; studentId: string },
        config: DataAccessConfig<'assignmentPersonalComments'> = {},
    ) {
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
    }

    async createComment(
        input: InsertCommentInput,
        config: DataAccessConfig<'comments'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(comments)
            .values(input)
            .returning();
    }
}

const personalCommentsData = new PersonalCommentsData();
export default personalCommentsData;
