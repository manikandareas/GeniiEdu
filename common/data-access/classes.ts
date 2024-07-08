import { eq, sql } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { InsertClassesInput } from './types';

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
