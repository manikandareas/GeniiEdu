import { eq } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { emailVerifications } from '../_libs/db/schema';

export type InsertEmailVerificationInput =
    typeof emailVerifications._.inferInsert;

export type PatchEmailVerificationInput = Partial<SelectEmailVerification>;

export type SelectEmailVerification = typeof emailVerifications._.inferSelect;

class EmailVerificationsData {
    async create(input: InsertEmailVerificationInput) {
        return await db.insert(emailVerifications).values(input).returning();
    }

    async findByUserId(userId: string) {
        return await db.query.emailVerifications.findFirst({
            where: (emailVerifications, { eq }) =>
                eq(emailVerifications.userId, userId),
        });
    }

    async findByUserIdAndCode(userId: string, code: string) {
        return await db.query.emailVerifications.findFirst({
            where: (emailVerifications, { and, eq }) =>
                and(
                    eq(emailVerifications.userId, userId),
                    eq(emailVerifications.code, code),
                ),
        });
    }

    async patch(input: PatchEmailVerificationInput) {
        return await db
            .update(emailVerifications)
            .set(input)
            .where(eq(emailVerifications.userId, input.userId!))
            .returning();
    }

    async deleteByUserId(userId: string) {
        return await db
            .delete(emailVerifications)
            .where(eq(emailVerifications.userId, userId));
    }
}

const emailVerificationsData = new EmailVerificationsData();
export default emailVerificationsData;
