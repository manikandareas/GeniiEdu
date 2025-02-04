import db from '@/app/_libs/db/DB';
import { oauthAccounts, users } from '@/app/_libs/db/schema';
import { lucia } from '@/app/_libs/lucia';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { google } from '@/app/_libs/lucia/oauth';
import { Env } from '@/app/_libs/env';
import { GoogleAuthenticatedUser } from '@/app/_types/oauth';

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error && error === 'access_denied') {
            return NextResponse.redirect(new URL('/login', url), {
                status: 302,
            });
        }

        if (!code || !state) {
            return Response.json(
                { error: 'Invalid request' },
                {
                    status: 400,
                },
            );
        }

        const codeVerifier = cookies().get('codeVerifier')?.value;
        const savedState = cookies().get('state')?.value;

        if (!codeVerifier || !savedState) {
            return Response.json(
                { error: 'Code verifier or saved state is not exists' },
                {
                    status: 400,
                },
            );
        }

        if (savedState !== state) {
            return Response.json(
                {
                    error: 'State does not match',
                },
                {
                    status: 400,
                },
            );
        }

        const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
            await google.validateAuthorizationCode(code, codeVerifier);

        const googleRes = await fetch(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'GET',
            },
        );

        const googleData = (await googleRes.json()) as GoogleAuthenticatedUser;

        let userId = '';

        await db.transaction(async (trx) => {
            const registeredUserWithGoogle =
                await trx.query.oauthAccounts.findFirst({
                    where: eq(oauthAccounts.providerUserId, googleData.id),
                });

            if (!registeredUserWithGoogle) {
                const createdUserRes = await trx
                    .insert(users)
                    .values({
                        name: googleData.name,
                        username: googleData.given_name,
                        profilePicture: googleData.picture,
                    })
                    .returning({
                        id: users.id,
                    });

                if (createdUserRes.length === 0) {
                    trx.rollback();
                    return Response.json(
                        { error: 'Failed to create user' },
                        {
                            status: 500,
                        },
                    );
                }

                const createdOAuthAccountRes = await trx
                    .insert(oauthAccounts)
                    .values({
                        accessToken,
                        expiresAt: accessTokenExpiresAt,
                        provider: 'google',
                        providerUserId: googleData.id,
                        userId: createdUserRes[0].id,
                        refreshToken,
                    });

                if (createdOAuthAccountRes.count === 0) {
                    trx.rollback();
                    return Response.json(
                        { error: 'Failed to create OAuthAccountRes' },
                        {
                            status: 500,
                        },
                    );
                }

                userId = createdUserRes[0].id;
            } else {
                const updatedOAuthAccountRes = await trx
                    .update(oauthAccounts)
                    .set({
                        accessToken,
                        expiresAt: accessTokenExpiresAt,
                        refreshToken,
                    })
                    .where(eq(oauthAccounts.providerUserId, googleData.id))
                    .returning({
                        userId: oauthAccounts.userId,
                    });

                if (updatedOAuthAccountRes.length === 0) {
                    trx.rollback();
                    return Response.json(
                        { error: 'Failed to update OAuthAccountRes' },
                        {
                            status: 500,
                        },
                    );
                }

                userId = updatedOAuthAccountRes[0].userId;
            }

            return NextResponse.redirect(
                new URL('/', Env.NEXT_PUBLIC_APP_URL),
                {
                    status: 302,
                },
            );
        });

        const session = await lucia.createSession(userId, {
            expiresIn: 60 * 60 * 24 * 30,
        });
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        cookies().set('state', '', {
            expires: new Date(0),
        });
        cookies().set('codeVerifier', '', {
            expires: new Date(0),
        });

        return NextResponse.redirect(new URL('/', Env.NEXT_PUBLIC_APP_URL), {
            status: 302,
        });
    } catch (error: any) {
        return Response.json(
            { error: error.message },
            {
                status: 500,
            },
        );
    }
};
