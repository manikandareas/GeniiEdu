import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertSubmissionInput,
    PatchSubmissionInput,
} from './types';
import db from '../libs/DB';
import { eq } from 'drizzle-orm';

export const insertSubmission = async (
    input: InsertSubmissionInput,
    config: DataAccessConfig<'submissions'> = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(Schema.submissions)
        .values(input)
        .returning();

    return response;
};

export const patchSubmission = async (
    input: PatchSubmissionInput,
    config: DataAccessConfig<'submissions'> = {},
) => {
    return await (config.tx ? config.tx : db)
        .update(Schema.submissions)
        .set(input)
        .where(eq(Schema.submissions.id, input.id!))
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
