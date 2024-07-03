import { eq, sql } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { InsertClassesInput, InsertModuleIntoClassInput } from './types';

export const findClassBySlug = async (slug: string) => {
    return await db.query.classes.findFirst({
        where: (classes, { eq }) => eq(classes.slug, slug),
    });
};

export const findClassByCode = async (code: string) => {
    return await db.query.classes.findFirst({
        where: (classes, { eq }) => eq(classes.classCode, code),
    });
};

export const findClassById = async (id: string) => {
    return await db.query.classes.findFirst({
        where: (classes, { eq }) => eq(classes.id, id),
    });
};

export const findStudentInClass = async (userId: string, classId: string) => {
    return await db.query.classMembers.findFirst({
        where: (classMembers, { and, eq }) =>
            and(
                eq(classMembers.classId, classId),
                eq(classMembers.userId, userId),
            ),
    });
};

export const insertClassMember = async (userId: string, classId: string) => {
    return await db.insert(Schema.classMembers).values({
        classId,
        userId,
    });
};

export const insertClass = async (classData: InsertClassesInput) => {
    return await db.insert(Schema.classes).values(classData).returning();
};

export const findClassWithThumbnailTeacher = async (slug: string) => {
    return await db.query.classes.findFirst({
        where: (classData, { eq }) => eq(classData.slug, slug),
        with: {
            thumbnail: true,
            teacher: true,
        },
    });
};

export const getMaximumPositionModule = async (moduleId: string) => {
    return await db
        .select({
            maxPosition: sql`MAX(${Schema.classModules.position}) AS maxPosition`,
        })
        .from(Schema.classModules)
        .where(eq(Schema.classModules.moduleId, moduleId));
};

export const insertModuleIntoClass = async (
    input: InsertModuleIntoClassInput,
) => {
    const maxPositionResult = await getMaximumPositionModule(input.moduleId);

    const maxPosition = maxPositionResult[0].maxPosition;
    const nextPosition = maxPosition !== null ? (maxPosition as number) + 1 : 0;

    return await db
        .insert(Schema.classModules)
        .values({
            ...input,
            position: nextPosition,
        })
        .returning();
};

export const findClassModulesWithDetails = async (classId: string) => {
    return await db.query.classModules.findMany({
        where: (classModules, { eq }) => eq(classModules.classId, classId),
        with: {
            module: {
                with: {
                    materials: {
                        with: {
                            material: true,
                        },
                    },
                    assignments: {
                        with: {
                            assignment: true,
                        },
                    },
                },
            },
        },
    });
};
