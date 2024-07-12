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

export const findDetailsLearningMaterial = async (
    id: string,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db).query.learningMaterials.findFirst(
        {
            where: (learningMaterials, { eq }) => eq(learningMaterials.id, id),
            with: {
                files: {
                    with: {
                        file: true,
                    },
                },
                author: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        profilePicture: true,
                    },
                },
                class: {
                    columns: {
                        className: true,
                        slug: true,
                    },
                },
            },
        },
    );
};
