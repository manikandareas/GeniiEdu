import db from '../libs/DB';
import { Schema } from '../models';
import { DataAccessConfig, InsertModuleInput } from './types';

export const findModuleBySlug = (
    slug: string,
    config: DataAccessConfig = {},
) => {
    return (config.tx ? config.tx : db).query.modules.findFirst({
        where: (modules, { eq }) => eq(modules.slug, slug),
    });
};

export const insertModule = (
    input: InsertModuleInput,
    config: DataAccessConfig = {},
) => {
    return (config.tx ? config.tx : db)
        .insert(Schema.modules)
        .values(input)
        .returning();
};

export const findTeacherModules = async (
    teacherId: string,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db).query.modules.findMany({
        where: (modules, { eq }) => eq(modules.authorId, teacherId),
    });
};

export const findDetailModuleBySlug = async (slug: string) => {
    return await db.query.modules.findFirst({
        where: (modules, { eq }) => eq(modules.slug, slug),
        with: {
            materials: {
                with: {
                    material: true,
                },
            },
            assignments: true,
        },
    });
};
