import { eq, sql } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertLearningMaterialFilesInput,
    InsertLearningMaterialInput,
} from './types';

export const insertLearningMaterial = async (
    input: InsertLearningMaterialInput,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(Schema.learningMaterials)
        .values(input)
        .returning();
};

export const insertLearningMaterialFiles = async (
    input: InsertLearningMaterialFilesInput[],
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(Schema.learningMaterialFiles)
        .values(input)
        .returning();
};
