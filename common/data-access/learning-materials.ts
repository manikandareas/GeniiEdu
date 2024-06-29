import { eq, sql } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import {
    DataAccessConfig,
    InsertLearningMaterialFilesInput,
    InsertLearningMaterialInput,
    InsertMaterialModuleInput,
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

export const getMaximumPositionMaterial = async (
    moduleId: string,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .select({
            maxPosition: sql`MAX(${Schema.materialModules.position}) AS maxPosition`,
        })
        .from(Schema.materialModules)
        .where(eq(Schema.materialModules.moduleId, moduleId));
};

export const insertMaterialModule = async (
    input: InsertMaterialModuleInput,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(Schema.materialModules)
        .values(input)
        .returning();
};
