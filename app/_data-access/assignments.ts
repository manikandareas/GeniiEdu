import { eq } from 'drizzle-orm';
import db from '@/app/_libs/db/DB';
import { DataAccessConfig } from './types';
import { assignments, files } from '@/app/_libs/db/schema';
import { User } from 'lucia';

export type InsertAssignmentInput = typeof assignments._.inferInsert;
export type PatchAssignmentInput = Partial<InsertAssignmentInput>;

class AssignmentsData {
    async create(
        input: InsertAssignmentInput,
        config: DataAccessConfig<'assignments'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(assignments)
            .values(input)
            .returning()
            .then((res) => res[0]);
    }

    async patch(
        input: PatchAssignmentInput,
        config: DataAccessConfig<'assignments'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .update(assignments)
            .set(input)
            .where(eq(assignments.id, input.id!))
            .returning();
    }

    async findUpcomingTasks(
        classId: string,
        config: DataAccessConfig<'assignments'> = {},
    ) {
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
    }

    // async findOneForStudent(
    //     id: string,
    //     userId: string,
    //     config: DataAccessConfig<'assignments'> = {},
    // ) {
    //     return await (config.tx ? config.tx : db).query.assignments.findFirst({
    //         where: (assignment, { eq }) => eq(assignment.id, id),
    //         with: {
    //             submissions: {
    //                 where: (submission, { eq }) =>
    //                     eq(submission.studentId, userId),
    //                 with: {
    //                     files: true,
    //                     student: {
    //                         columns: {
    //                             name: true,
    //                             profilePicture: true,
    //                             id: true,
    //                             email: true,
    //                             username: true,
    //                         },
    //                     },
    //                 },
    //             },
    //             files: true,
    //             author: {
    //                 columns: {
    //                     name: true,
    //                     profilePicture: true,
    //                     id: true,
    //                     email: true,
    //                     username: true,
    //                 },
    //             },
    //             class: true,
    //         },
    //     });
    // }

    async findOneWithDetails(
        id: string,
        config: DataAccessConfig<'assignments'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.assignments.findFirst({
            where: (assignment, { eq, and }) => eq(assignment.id, id),
            with: {
                class: true,
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
                files: true,
                author: {
                    columns: {
                        name: true,
                        profilePicture: true,
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            },
        });
    }

    async findOne(id: string, config: DataAccessConfig<'assignments'> = {}) {
        return await (config.tx ? config.tx : db).query.assignments.findFirst({
            ...config.queryConfig,
            where: (assignment, { eq }) => eq(assignment.id, id),
        });
    }

    W_CLASS_AUTHOR_FILES = {
        author: {
            columns: {
                name: true,
                profilePicture: true,
                id: true,
                email: true,
                username: true,
            },
        },
        files: true,
        class: true,
    } as const;

    // async findOneWithDetails(
    //     id: string,
    //     user: User,
    //     config: DataAccessConfig<'assignments'> = {},
    // ) {
    //     if (user?.role === 'student') {
    //         return this.findOneForStudent(id, user.id, config);
    //     }
    //     return this.findOneForTeacher(id, user.id, config);
    // }
}

const assignmentsData = new AssignmentsData();
export default assignmentsData;

// export const findAssignment = async (
//     assignmentId: string,
//     config: DataAccessConfig<'assignments'> = {},
// ) => {
//     return await (config.tx ? config.tx : db).query.assignments.findFirst({
//         where: (assignment, { eq }) => eq(assignment.id, assignmentId),
//     });
// };
