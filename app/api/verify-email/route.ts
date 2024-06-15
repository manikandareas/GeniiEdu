import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { Env } from '@/common/libs/Env';
import { and, eq } from 'drizzle-orm';
import db from '@/common/libs/DB';
import { emailVerifications, users } from '@/common/models/Schema';
import { lucia } from '@/common/libs/lucia';
import { cookies } from 'next/headers';

export const GET = async (request: NextRequest) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return Response.json(
            {
                message: 'Token is not exist',
            },
            {
                status: 400,
            },
        );
    }

    try {
        const decoded = jwt.verify(token, Env.JWT_SECRET) as {
            email: string;
            code: string;
            userId: string;
        };

        const emailVerificationQueryResult =
            await db.query.emailVerifications.findFirst({
                where: and(
                    eq(emailVerifications.userId, decoded.userId),
                    eq(emailVerifications.code, decoded.code),
                ),
            });

        if (!emailVerificationQueryResult) {
            return Response.json(
                {
                    message: 'Invalid Token',
                },
                {
                    status: 400,
                },
            );
        }

        await db
            .delete(emailVerifications)
            .where(eq(emailVerifications.userId, decoded.userId));

        await db
            .update(users)
            .set({ isEmailVerified: true })
            .where(eq(users.id, decoded.userId));

        const session = await lucia.createSession(decoded.userId, {
            expiresIn: 60 * 60 * 24 * 30,
        });

        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        return Response.redirect(
            new URL(Env.NEXT_PUBLIC_APP_URL!, request.url),
            302,
        );
    } catch (error: any) {
        return Response.json(
            {
                message: error.message,
            },
            {
                status: 400,
            },
        );
    }
};
