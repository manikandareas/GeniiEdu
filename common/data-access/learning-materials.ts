import { eq, sql } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { DataAccessConfig, InsertLearningMaterialInput } from './types';

export const insertLearningMaterial = async (
    input: InsertLearningMaterialInput,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .insert(Schema.learningMaterials)
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
                files: true,
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
