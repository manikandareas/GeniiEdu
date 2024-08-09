import { eq } from 'drizzle-orm';
import db from '@/app/_libs/db/DB';
import { validateRequest } from '@/app/_libs/lucia';
import { DataAccessConfig } from './types';
import { assignments } from '@/app/_libs/db/schema';

export type InsertAssignmentInput = typeof assignments._.inferInsert;
export type PatchAssignmentInput = Partial<InsertAssignmentInput>;

export const insertAssignment = async (
    input: InsertAssignmentInput,
    config: DataAccessConfig<'assignments'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(assignments)
        .values(input)
        .returning();
    return response;
};

export const findAssignment = async (
    assignmentId: string,
    config: DataAccessConfig<'assignments'> = {},
) => {
    return await (config.tx ? config.tx : db).query.assignments.findFirst({
        where: (assignment, { eq }) => eq(assignment.id, assignmentId),
    });
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
        .update(assignments)
        .set(input)
        .where(eq(assignments.id, input.id!))
        .returning();
};

export const findUpcomingTasks = async (
    classId: string,
    config: DataAccessConfig<'assignments'> = {},
) => {
    return await (config.tx ? config.tx : db).query.assignments.findMany({
        where: (assignments, { and, gt, eq }) =>
            and(
                gt(assignments.dueDate, new Date()),
                eq(assignments.isOpen, true),
                eq(assignments.classId, classId),
            ),
        orderBy: (assignments, { asc }) => asc(assignments.dueDate),
        columns: {
            id: true,
            title: true,
            dueDate: true,
        },
    });
};
