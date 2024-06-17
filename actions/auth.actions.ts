'use server';

import db from '@/common/libs/DB';
import { Env } from '@/common/libs/Env';
import { lucia, validateRequest } from '@/common/libs/lucia';
import { github, google } from '@/common/libs/lucia/oauth';
import { generateRandomNumber } from '@/common/libs/utils';
import { AuthModel, Schema } from '@/common/models';
import GeniiEduVerificationEmail from '@/common/templates/verify-email.template';
import { generateCodeVerifier, generateState } from 'arctic';
import * as argon from 'argon2';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import React from 'react';
import { z } from 'zod';
import { sendEmail } from './email.actions';
import { ActRes } from '@/common/types/Action.type';
import { DefaultProfile } from '@/common/constants/DefaultProfile';

// * Actions running expectedly
export const resendEmailVerification = async (email: string) => {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(Schema.users.email, email),
        });

        if (!existingUser) {
            return {
                error: 'User not found',
                success: false,
            } satisfies ActRes;
        }

        if (existingUser.isEmailVerified) {
            return {
                error: 'Email is already verified',
                success: false,
            } satisfies ActRes;
        }

        const existedCode = await db.query.emailVerifications.findFirst({
            where: eq(Schema.emailVerifications.userId, existingUser.id),
        });

        if (!existedCode) {
            return {
                error: 'Code not found',
                success: false,
            } satisfies ActRes;
        }

        const sentAt = new Date(existedCode.sentAt!);

        const isOneMinuteHasPassed =
            new Date().getTime() - sentAt.getTime() > 60 * 1000;

        if (!isOneMinuteHasPassed) {
            return {
                error: `Code has been sent recently, next email can be sent in ${60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)} seconds`,
                success: false,
            } satisfies ActRes;
        }

        // Random String for email verification
        const code = generateRandomNumber(6);
        await db
            .update(Schema.emailVerifications)
            .set({ code, sentAt: new Date().toDateString() })
            .where(eq(Schema.emailVerifications.userId, existingUser.id));

        const token = jwt.sign(
            { email: email, userId: existingUser.id, code },
            Env.JWT_SECRET as string,
            { expiresIn: '5h' },
        );

        const url = `${Env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

        await sendEmail({
            to: [existingUser.email!],
            subject: 'Verify your email address',
            react: React.createElement(GeniiEduVerificationEmail, {
                username: existingUser.username || existingUser.email!,
                verificationCode: code,
                verificationLink: url,
            }),
        });
        return {
            success: true,
            message: 'Email has been sent',
        };
    } catch (error: any) {
        console.error(error);
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

// * Actions running expectedly
export const isEmailVerified = async (email: string) => {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(Schema.users.email, email),
        });
        if (!existingUser) {
            return {
                error: 'User not found',
                success: false,
            } satisfies ActRes;
        }

        if (existingUser.isEmailVerified) {
            return {
                success: true,
                data: true,
            } satisfies ActRes<boolean>;
        }

        return {
            success: true,
            data: false,
        } satisfies ActRes<boolean>;
    } catch (error: any) {
        console.error(error);
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

// * Actions running expectedly
export const signUp = async (
    values: z.infer<typeof AuthModel.insertUserSchema>,
) => {
    const hashedPassword: string = await argon.hash(values.password);

    try {
        const userId = await db
            .insert(Schema.users)
            .values({
                email: values.email,
                passwordHash: hashedPassword,
                profilePicture: DefaultProfile.profilePicture,
            })
            .returning({
                userId: Schema.users.id,
            })
            .then((res) => res[0].userId);

        // Random String for email verification
        const code = generateRandomNumber(6);

        await db.insert(Schema.emailVerifications).values({
            code,
            userId,
            sentAt: new Date().toDateString(),
        });

        const token = jwt.sign(
            { email: values.email, userId, code },
            Env.JWT_SECRET as string,
            { expiresIn: '5h' },
        );

        const url = `${Env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;
        console.log({ url });

        // TODO: Send email
        await sendEmail({
            to: [values.email],
            subject: 'Verify your email address',
            react: React.createElement(GeniiEduVerificationEmail, {
                username: values.email,
                verificationCode: code,
                verificationLink: url,
            }),
        });

        return {
            success: true,
            message: "We've sent you an email. Please verify your email",
        };
    } catch (error) {
        console.error(error);

        return {
            error: 'Failed to sign up',
        };
    }
};

export const signIn = async (
    values: z.infer<typeof AuthModel.loginUserSchema>,
) => {
    try {
        AuthModel.loginUserSchema.parse(values);
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(Schema.users.email, values.email),
    });

    if (!existingUser) {
        return {
            error: 'User does not exist',
            success: false,
        } satisfies ActRes;
    }

    if (!existingUser.passwordHash) {
        return {
            error: 'User does not exist',
            success: false,
        } satisfies ActRes;
    }

    const isPasswordMatch = await argon.verify(
        existingUser.passwordHash,
        values.password,
    );

    if (!isPasswordMatch) {
        return {
            error: 'Incorrect email or password',
            success: false,
        } satisfies ActRes;
    }

    const session = lucia.createSession(existingUser.id, {
        expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie((await session).id);

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );

    return {
        success: true,
        message: 'Logged in successfully',
    } satisfies ActRes;
};

// * Actions running expectedly
export const signOut = async () => {
    try {
        const { session } = await validateRequest();

        if (!session) {
            return {
                error: 'Unauthorized',
                success: false,
            } satisfies ActRes;
        }

        await lucia.invalidateSession(session.id);

        const sessionCookie = lucia.createBlankSessionCookie();

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        return {
            success: true,
            message: 'Logged out successfully',
        } satisfies ActRes;
    } catch (error: any) {
        console.error(error);

        return {
            success: false,
            error: error.message,
        } satisfies ActRes;
    }
};

// * Actions running expectedly
export const verifyEmail = async (
    email: string,
    values: z.infer<typeof AuthModel.verifyEmailSchema>,
) => {
    try {
        // ! Already checked in verify-email page
        const existingUser = await db.query.users.findFirst({
            where: eq(Schema.users.email, email),
        });

        if (!existingUser) {
            return {
                error: 'Invalid code',
                success: false,
            } satisfies ActRes;
        }

        if (existingUser.isEmailVerified) {
            return {
                error: 'User is already verified',
                success: false,
            } satisfies ActRes;
        }

        // !

        // ? Check if code is valid and match
        const existingCode = await db.query.emailVerifications.findFirst({
            where: and(
                eq(Schema.emailVerifications.userId, existingUser.id),
                eq(Schema.emailVerifications.code, values.code),
            ),
        });

        if (!existingCode) {
            return {
                error: 'Invalid code',
                success: false,
            } satisfies ActRes;
        }

        await db
            .delete(Schema.emailVerifications)
            .where(eq(Schema.emailVerifications.userId, existingUser.id));

        await db
            .update(Schema.users)
            .set({ isEmailVerified: true })
            .where(eq(Schema.users.id, existingUser.id));

        return {
            success: true,
            message: 'Email verified successfully',
        } satisfies ActRes;
    } catch (error: any) {
        console.error(error);
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

// export const resetPassword = async (
//     values: z.infer<typeof schema.resetPasswordSchema>
//   ) => {
//     try {

//       const existedUser = await db.query.users.findFirst({
//         where: (table) => eq(table.email, values.email),
//       })

//       if (!existedUser) {
//         return {
//           success: false,
//           message: "User not found",
//         }
//       }

//       const isValidPassword = await argon2.verify(
//         existedUser?.hashedPassword!,
//         values.password
//       )

//       if (!isValidPassword) {
//         return {
//           success: false,
//           message: "Invalid password",
//         }
//       }

//       const hashedPassword = await argon2.hash(values.newPassword)

//       await db
//         .update(userTable)
//         .set({
//           hashedPassword,
//         })
//         .where(eq(userTable.id, user.id))

//       await db.delete(sessionTable).where(eq(sessionTable.userId, user.id))

//       const session = await lucia.createSession(existedUser.id, {
//         expiresIn: 60 * 60 * 24 * 30,
//       })

//       const sessionCookie = lucia.createSessionCookie(session.id)

//       cookies().set(
//         sessionCookie.name,
//         sessionCookie.value,
//         sessionCookie.attributes
//       )

//       return {
//         success: true,
//         message: "Password updated",
//       }
//     } catch (error: any) {
//       return {
//         success: false,
//         message: error.message,
//       }
//     }
//   }

// * Actions running expectedly
export const createGithubAuthorizationURL = async () => {
    try {
        const state = generateState(); // generate a random string 6 characters long

        cookies().set('state', state, {
            httpOnly: true,
        });

        const authorizationURL = await github.createAuthorizationURL(state, {
            scopes: ['user:email'],
        });

        return {
            success: true,
            data: authorizationURL.toString(),
        };
    } catch (error: any) {
        return {
            error: error?.message,
        };
    }
};

// * Actions running expectedly
export const createGoogleAuthorizationURL = async () => {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();

        cookies().set('codeVerifier', codeVerifier, {
            httpOnly: true,
        });

        cookies().set('state', state, {
            httpOnly: true,
        });

        const authorizationURL = await google.createAuthorizationURL(
            state,
            codeVerifier,
            {
                scopes: ['email', 'profile'],
            },
        );

        return {
            success: true,
            data: authorizationURL.toString(),
        };
    } catch (error: any) {
        return {
            error: error?.message,
        };
    }
};
