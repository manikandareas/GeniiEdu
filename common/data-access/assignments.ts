import { eq } from 'drizzle-orm';
import db from '../libs/DB';
import { validateRequest } from '../libs/lucia';
import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertAssignmentInput,
    PatchAssignmentInput,
} from './types';

export const insertAssignment = async (
    input: InsertAssignmentInput,
    config: DataAccessConfig<'assignments'> = {},
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
    config: DataAccessConfig<'assignments'> = {},
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
            author: {
                columns: {
                    name: true,
                },
            },
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

export const findDetailsAssignmentForTeacher = async (
    id: string,
    userId: string,
    config: DataAccessConfig<'assignments'> = {},
) => {
    return await (config.tx ? config.tx : db).query.assignments.findFirst({
        where: (assignment, { eq, and }) =>
            and(eq(assignment.id, id), eq(assignment.authorId, userId)),
        with: {
            submissions: {
                with: {
                    student: {
                        columns: {
                            name: true,
                            profilePicture: true,
                            id: true,
                            email: true,
                            username: true,
                        },
                    },
                    files: true,
                },
            },
            author: {
                columns: {
                    id: true,
                    name: true,
                },
            },
            files: true,
            class: {
                columns: {
                    id: true,
                    className: true,
                },
            },
        },
    });
};

export type FindDetailsAssignmentForTeacherResponse = Awaited<
    ReturnType<typeof findDetailsAssignmentForTeacher>
>;

type FindDetailsAssignmentProps = {
    id: string;
    userId: string;
};

export const findDetailsAssignment = async (
    properties: FindDetailsAssignmentProps,
    config: DataAccessConfig<'assignments'> = {},
) => {
    const { user } = await validateRequest();
    if (user?.role === 'student') {
        return findDetailsAssignmentForStudent(
            properties.id,
            properties.userId,
            config,
        );
    }
    return findDetailsAssignmentForTeacher(
        properties.id,
        properties.userId,
        config,
    );
};

export type FindDetailsAssignmentResponse = Awaited<
    ReturnType<typeof findDetailsAssignment>
>;

export const patchAssignment = async (
    input: PatchAssignmentInput,
    config: DataAccessConfig<'assignments'> = {},
) => {
    return await (config.tx ? config.tx : db)
        .update(Schema.assignments)
        .set(input)
        .where(eq(Schema.assignments.id, input.id!))
        .returning();
};
