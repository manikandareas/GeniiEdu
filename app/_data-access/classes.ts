import db from '../_libs/db/DB';
import { classes } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertClassesInput = typeof classes._.inferInsert;

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

export const findClassById = async (
    id: string,
    config: DataAccessConfig<'classes'> = {},
) => {
    return await db.query.classes.findFirst({
        ...config.queryConfig,
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

export const insertClass = async (classData: InsertClassesInput) => {
    return await db.insert(classes).values(classData).returning();
};

export const isOwnerOfClass = async (userId: string, classSlug: string) => {
    return await db.query.classes.findFirst({
        where: (classes, { and, eq }) =>
            and(eq(classes.slug, classSlug), eq(classes.teacherId, userId)),
    });
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

/**
 * Find details of a class by slug including learning materials, assignments, teacher, thumbnail, and members' user data.
 *
 * @param {string} slug - The slug of the class to find details for.
 * @return {Promise} The details of the class including learning materials, assignments, teacher, thumbnail, announcements and members.
 */
export const findDetailsClass = async (slug: string) => {
    return await db.query.classes.findFirst({
        where: (classData, { eq }) => eq(classData.slug, slug),
        with: {
            learningMaterials: {
                with: {
                    files: true,
                },
            },

            assignments: true,
            teacher: true,
            thumbnail: true,
            members: {
                with: {
                    user: {
                        columns: {
                            name: true,
                            username: true,
                            profilePicture: true,
                            email: true,
                        },
                    },
                },
            },
            announcements: true,
        },
    });
};

export const findIDMembersOfClass = async (classId: string) => {
    const res = await db.query.classMembers.findMany({
        columns: {
            userId: true,
        },
        where: (classMembers, { and, eq }) =>
            and(
                eq(classMembers.classId, classId),
                eq(classMembers.role, 'student'),
            ),
    });

    return res.map((member) => member.userId);
};
