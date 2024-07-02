import { eq } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { DataAccessConfig, InsertModuleInput, PatchModuleInput } from './types';

export const findModuleBySlug = (
    slug: string,
    config: DataAccessConfig = {},
) => {
    return (config.tx ? config.tx : db).query.modules.findFirst({
        where: (modules, { eq }) => eq(modules.slug, slug),
    });
};

export const findModuleById = async (id: string) => {
    return await db.query.modules.findFirst({
        where: (modules, { eq }) => eq(modules.id, id),
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

export const patchModule = async (
    input: PatchModuleInput,
    moduleId: string,
) => {
    return await db
        .update(Schema.modules)
        .set(input)
        .where(eq(Schema.modules.id, moduleId))
        .returning();
};

export const findClassesUsedModule = async (moduleId: string) => {
    const response = await db.query.classModules.findMany({
        where: (classModules, { eq }) => eq(classModules.moduleId, moduleId),
        with: {
            class: {
                with: {
                    thumbnail: true,
                },
            },
        },
    });

    const classes = response.map((classModule) => classModule.class);

    return classes;
};
