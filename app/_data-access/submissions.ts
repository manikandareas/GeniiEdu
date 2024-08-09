import { DataAccessConfig } from './types';
import db from '../_libs/db/DB';
import { eq } from 'drizzle-orm';
import { submissions } from '../_libs/db/schema';

export type InsertSubmissionInput = typeof submissions._.inferInsert;

export type PatchSubmissionInput = Partial<InsertSubmissionInput>;

export const insertSubmission = async (
    input: InsertSubmissionInput,
    config: DataAccessConfig<'submissions'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(submissions)
        .values(input)
        .returning();

    return response;
};

export const patchSubmission = async (
    input: PatchSubmissionInput,
    config: DataAccessConfig<'submissions'> = {},
) => {
    return await (config.tx ? config.tx : db)
        .update(submissions)
        .set(input)
        .where(eq(submissions.id, input.id!))
        .returning();
};

export const findSubmissionById = async (
    id: string,
    config: DataAccessConfig<'submissions'> = {},
) => {
    return await (config.tx ? config.tx : db).query.submissions.findFirst({
        where: (submission, { eq }) => eq(submission.id, id),
        with: {
            assignment: true,
        },
    });
};
