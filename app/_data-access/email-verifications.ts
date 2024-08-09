import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { emailVerifications } from '../_libs/db/schema';

export type InsertEmailVerificationInput =
    typeof emailVerifications._.inferInsert;

export type PatchEmailVerificationInput = Partial<SelectEmailVerification>;

export type SelectEmailVerification = typeof emailVerifications._.inferSelect;

export const findEmailVerificationByUserId = async (userId: string) => {
    return await db.query.emailVerifications.findFirst({
        where: (emailVerifications, { eq }) =>
            eq(emailVerifications.userId, userId),
    });
};

export const insertEmailVerification = async (
    input: InsertEmailVerificationInput,
) => {
    return await db.insert(emailVerifications).values(input).returning();
};

export const patchEmailVerification = async (
    input: PatchEmailVerificationInput,
) => {
    return await db
        .update(emailVerifications)
        .set(input)
        .where(eq(emailVerifications.userId, input.userId!))
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
        .delete(emailVerifications)
        .where(eq(emailVerifications.userId, userId));
};
