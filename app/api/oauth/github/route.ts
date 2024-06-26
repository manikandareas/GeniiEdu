import db from '@/common/libs/DB';
import { Env } from '@/common/libs/Env';
import { lucia } from '@/common/libs/lucia';
import { github } from '@/common/libs/lucia/oauth';
import { oauthAccounts, users } from '@/common/models/schema.model';
import { GithubAuthenticatedUser } from '@/common/types/Oauth.type';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;

        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
            return Response.json(
                { error: 'Invalid request' },
                {
                    status: 400,
                },
            );
        }

        const savedState = cookies().get('state')?.value;

        if (!savedState) {
            return Response.json(
                { error: 'saved state is not exists' },
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

        const { accessToken } = await github.validateAuthorizationCode(code);

        const githubRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            method: 'GET',
        });

        const githubData = (await githubRes.json()) as GithubAuthenticatedUser;

        console.log('githubData', githubData);

        let createdUserID: string = '';

        await db.transaction(async (trx) => {
            const registeredUserWithGithub =
                await trx.query.oauthAccounts.findFirst({
                    where: eq(
                        oauthAccounts.providerUserId,
                        githubData.id.toString(),
                    ),
                });

            if (!registeredUserWithGithub) {
                const createdUserRes = await trx
                    .insert(users)
                    .values({
                        name: githubData.name,
                        username: githubData.login,
                        profilePicture: githubData.avatar_url,
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

                createdUserID = createdUserRes[0].id;

                const createdOAuthAccountsRes = await trx
                    .insert(oauthAccounts)
                    .values({
                        accessToken,
                        provider: 'github',
                        providerUserId: githubData.id.toString(),
                        userId: createdUserRes[0].id,
                    });

                if (createdOAuthAccountsRes.count === 0) {
                    trx.rollback();
                    return Response.json(
                        { error: 'Failed to create OAuthAccountsRes' },
                        {
                            status: 500,
                        },
                    );
                }
            } else {
                const updatedOAuthAccountsRes = await trx
                    .update(oauthAccounts)
                    .set({
                        accessToken,
                    })
                    .where(
                        eq(
                            oauthAccounts.providerUserId,
                            githubData.id.toString(),
                        ),
                    )
                    .returning({
                        userId: oauthAccounts.userId,
                    });

                if (updatedOAuthAccountsRes.length === 0) {
                    trx.rollback();
                    return Response.json(
                        { error: 'Failed to update OAuthAccountsRes' },
                        {
                            status: 500,
                        },
                    );
                }

                createdUserID = updatedOAuthAccountsRes[0].userId;
            }

            return NextResponse.redirect(
                new URL('/', Env.NEXT_PUBLIC_APP_URL),
                {
                    status: 302,
                },
            );
        });

        console.log('createdUserID', createdUserID);

        const session = await lucia.createSession(createdUserID, {
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
