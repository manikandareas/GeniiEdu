import { DataAccessConfig } from './types';
import db from '../_libs/db/DB';
import { eq } from 'drizzle-orm';
import { submissions } from '../_libs/db/schema';

export type InsertSubmissionInput = typeof submissions._.inferInsert;

export type PatchSubmissionInput = Partial<InsertSubmissionInput>;

class SubmissionData {
    async create(
        input: InsertSubmissionInput,
        config: DataAccessConfig<'submissions'> = {},
    ) {
        const [response] = await (config.tx ? config.tx : db)
            .insert(submissions)
            .values(input)
            .returning();

        return response;
    }

    async patch(
        input: PatchSubmissionInput,
        config: DataAccessConfig<'submissions'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .update(submissions)
            .set(input)
            .where(eq(submissions.id, input.id!))
            .returning();
    }

    async findById(id: string, config: DataAccessConfig<'submissions'> = {}) {
        return await (config.tx ? config.tx : db).query.submissions.findFirst({
            where: (submission, { eq }) => eq(submission.id, id),
            with: {
                assignment: true,
            },
        });
    }

    async findOneWhereAssIdAndStudentId(
        assignmentId: string,
        studentId: string,
        config: DataAccessConfig<'submissions'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.submissions.findFirst({
            where: (submission, { and, eq }) =>
                and(
                    eq(submission.assignmentId, assignmentId),
                    eq(submission.studentId, studentId),
                ),
            with: {
                files: true,
            },
        });
    }

    async findManyWhereAssId(
        assignmentId: string,
        config: DataAccessConfig<'submissions'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.submissions.findMany({
            where: (submission, { eq }) =>
                eq(submission.assignmentId, assignmentId),
            with: {
                student: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        profilePicture: true,
                        username: true,
                    },
                },
                files: true,
            },
        });
    }
}
const submissionData = new SubmissionData();
export default submissionData;
