import { eq } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { InsertUserInput } from './types';

export const findUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });
};

export const insertUser = async (input: InsertUserInput) => {
    return await db.insert(Schema.users).values(input).returning();
};

export const patchUser = async (input: InsertUserInput, userId: string) => {
    return await db
        .update(Schema.users)
        .set(input)
        .where(eq(Schema.users.id, userId))
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
