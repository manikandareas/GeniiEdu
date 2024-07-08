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
