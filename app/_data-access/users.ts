import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { users } from '../_libs/db/schema';

export type InsertUserInput = typeof users._.inferInsert;

export type SelectUser = typeof users._.inferSelect;

export type PatchUserInput = Partial<SelectUser>;

export const findUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });
};

export const insertUser = async (input: InsertUserInput) => {
    return await db.insert(users).values(input).returning();
};

export const patchUser = async (input: InsertUserInput, userId: string) => {
    return await db
        .update(users)
        .set(input)
        .where(eq(users.id, userId))
        .returning();
};

export const findStudentClasses = async (studentId: string) => {
    return await db.query.classMembers.findMany({
        where: (classMembers, { eq }) => eq(classMembers.userId, studentId),
        with: {
            class: {
                with: {
                    teacher: true,
                    thumbnail: true,
                },
            },
        },
        orderBy(fields, operators) {
            return operators.asc(fields.joinedAt);
        },
    });
};

export const findUserClassesForSearch = async (userId: string) => {
    const query = await db.query.classMembers.findMany({
        where: (cm, { eq }) => eq(cm.userId, userId),
        with: {
            class: {
                columns: {
                    className: true,
                    description: true,
                    slug: true,
                },
            },
        },
        columns: {
            id: true,
        },
    });

    return query.map((data) => ({
        title: data.class.className,
        content: data.class.description,
        url: `/classes/${data.class.slug}`,
    }));
};
