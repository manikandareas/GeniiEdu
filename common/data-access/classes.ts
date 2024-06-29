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
