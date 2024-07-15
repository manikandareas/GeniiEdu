import { Schema } from '../models';
import { DataAccessConfig, InsertSubmissionInput } from './types';
import db from '../libs/DB';
export const insertSubmission = async (
    input: InsertSubmissionInput,
    config: DataAccessConfig = {},
) => {
    const [response] = await (config.tx ? config.tx : db)
        .insert(Schema.submissions)
        .values(input)
        .returning();

    return response;
};
