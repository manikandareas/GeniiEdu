import { eq } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import {
    InsertEmailVerificationInput,
    PatchEmailVerificationInput,
} from './types';

export const findEmailVerificationByUserId = async (userId: string) => {
    return await db.query.emailVerifications.findFirst({
        where: (emailVerifications, { eq }) =>
            eq(emailVerifications.userId, userId),
    });
};

export const insertEmailVerification = async (
    input: InsertEmailVerificationInput,
) => {
    return await db.insert(Schema.emailVerifications).values(input).returning();
};

export const patchEmailVerification = async (
    input: PatchEmailVerificationInput,
) => {
    return await db
        .update(Schema.emailVerifications)
        .set(input)
        .where(eq(Schema.emailVerifications.userId, input.userId!))
        .returning();
};

export const findEmailVerificationByUserIdAndCode = async (
    userId: string,
    code: string,
) => {
    return await db.query.emailVerifications.findFirst({
        where: (emailVerifications, { and, eq }) =>
            and(
                eq(emailVerifications.userId, userId),
                eq(emailVerifications.code, code),
            ),
    });
};

export const deleteEmailVerificationByUserId = async (userId: string) => {
    return await db
        .delete(Schema.emailVerifications)
        .where(eq(Schema.emailVerifications.userId, userId));
};
