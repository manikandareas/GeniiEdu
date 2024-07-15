import { DataAccessConfig, InsertAssignmentInput } from './types';
import db from '../libs/DB';
import { Schema } from '../models';

export const insertAssignment = async (
    input: InsertAssignmentInput,
    config: DataAccessConfig = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(Schema.assignments)
        .values(input)
        .returning();
    return response;
};

export const findDetailsAssignmentForStudent = async (
    id: string,
    userId: string,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db).query.assignments.findFirst({
        where: (assignment, { eq }) => eq(assignment.id, id),
        with: {
            submissions: {
                where: (submission, { eq }) => eq(submission.studentId, userId),
                with: {
                    files: true,
                },
            },
            files: true,
            author: true,
            class: {
                columns: {
                    id: true,
                    className: true,
                },
            },
        },
    });
};

export type FindDetailsAssignmentForStudentResponse = Awaited<
    ReturnType<typeof findDetailsAssignmentForStudent>
>;
