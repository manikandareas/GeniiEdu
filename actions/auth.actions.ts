'use server';

import { DEFAULT_PROFILE } from '@/common/constants/default-profile';
import {
    deleteEmailVerificationByUserId,
    findEmailVerificationByUserId,
    findEmailVerificationByUserIdAndCode,
    insertEmailVerification,
    patchEmailVerification,
} from '@/common/data-access/email-verifications';
import {
    insertUser,
    patchUser,
    findUserByEmail,
} from '@/common/data-access/users';
import GeniiEduVerificationEmail from '@/common/emails/verify-email';
import { Env } from '@/common/libs/Env';
import { lucia } from '@/common/libs/lucia';
import { github, google } from '@/common/libs/lucia/oauth';
import {
    ActionError,
    actionProcedure,
    authenticatedProcedure,
} from '@/common/libs/safe-action';
import { generateRandomNumber } from '@/common/libs/utils';
import { AuthModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { generateCodeVerifier, generateState } from 'arctic';
import * as argon from 'argon2';
import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import React from 'react';
import { z } from 'zod';
import { sendEmail } from './email.actions';

// * Actions running expectedly
const resendEmailVerificationSchema = z.string().email();
export const resendEmailVerification = actionProcedure
    .metadata({ actionName: 'resendEmailVerification' })
    .schema(resendEmailVerificationSchema)
    .action(async ({ parsedInput: email }) => {
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            throw new ActionError('User not found');
        }

        if (existingUser.isEmailVerified) {
            throw new ActionError('Email is already verified');
        }

        const existedCode = await findEmailVerificationByUserId(
            existingUser.id,
        );

        if (!existedCode) {
            throw new ActionError('Code not found');
        }

        const sentAt = new Date(existedCode.sentAt!);

        const isOneMinuteHasPassed =
            new Date().getTime() - sentAt.getTime() > 60 * 1000;

        if (!isOneMinuteHasPassed) {
            throw new ActionError(
                `Code has been sent recently, next email can be sent in ${60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)} seconds`,
            );
        }

        const code = generateRandomNumber(6);

        await patchEmailVerification({
            code,
            sentAt: new Date(),
        });

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
            message: 'Email has been sent',
        };
    });

// * Actions running expectedly
const isEmailVerifiedSchema = z.string().email();
export const isEmailVerified = actionProcedure
    .metadata({ actionName: 'isEmailVerified' })
    .schema(isEmailVerifiedSchema)
    .action(async ({ parsedInput: email }) => {
        const existingUser = await findUserByEmail(email);
        if (!existingUser) {
            throw new ActionError('User not found');
        }
        if (existingUser.isEmailVerified) {
            return {
                success: true,
                data: true,
            };
        }
        return {
            data: false,
        };
    });

// * Actions running expectedly
export const signUp = actionProcedure
    .metadata({ actionName: 'signUp' })
    .schema(AuthModel.insertUserSchema)
    .action(async ({ parsedInput }) => {
        const existingUser = await findUserByEmail(parsedInput.email);

        if (existingUser) {
            throw new ActionError('Email already used');
        }

        const hashedPassword = await argon.hash(parsedInput.password);

        const registeredUser = await insertUser({
            email: parsedInput.email,
            passwordHash: hashedPassword,
            profilePicture: DEFAULT_PROFILE.profilePicture,
        }).then((res) => res[0]);

        // Random String for email verification
        const code = generateRandomNumber(6);

        await insertEmailVerification({
            code,
            userId: registeredUser.id,
            sentAt: new Date(),
        });

        const token = jwt.sign(
            { email: parsedInput.email, userId: registeredUser.id, code },
            Env.JWT_SECRET as string,
            { expiresIn: '5h' },
        );

        const url = `${Env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

        // ? Send an verification email
        await sendEmail({
            to: [parsedInput.email],
            subject: 'Verify your email address',
            react: React.createElement(GeniiEduVerificationEmail, {
                username: parsedInput.email,
                verificationCode: code,
                verificationLink: url,
            }),
        });

        revalidatePath('/register');
        return {
            message: "We've sent you an email. Please verify your email",
        };
    });

// * Actions running expectedly
export const signIn = actionProcedure
    .metadata({ actionName: 'signIn' })
    .schema(AuthModel.loginUserSchema)
    .action(async ({ parsedInput }) => {
        const existingUser = await findUserByEmail(parsedInput.email);

        if (!existingUser) {
            throw new ActionError('Incorrect email or password');
        }

        if (!existingUser.passwordHash) {
            throw new ActionError('Incorrect email or password');
        }

        const isPasswordMatch = await argon.verify(
            existingUser.passwordHash,
            parsedInput.password,
        );

        if (!isPasswordMatch) {
            throw new ActionError('Incorrect email or password');
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

        revalidatePath('/login');

        const message = existingUser.username
            ? `Welcome ${existingUser.username}!`
            : 'Successfully logged in';

        return {
            message,
        };
    });

// * Actions running expectedly
export const signOut = authenticatedProcedure
    .metadata({ actionName: 'signOut' })
    .action(async ({ ctx }) => {
        await lucia.invalidateSession(ctx.session.id);

        const sessionCookie = lucia.createBlankSessionCookie();

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );

        return {
            message: 'Logged out successfully',
        };
    });

// * Actions running expectedly
export const verifyEmail = actionProcedure
    .metadata({ actionName: 'verifyEmail' })
    .schema(AuthModel.verifyEmailSchema)
    .bindArgsSchemas<[email: z.ZodString]>([z.string().email()])
    .action(async ({ parsedInput, bindArgsParsedInputs: [email] }) => {
        const existingUser = await findUserByEmail(email);

        if (!existingUser) {
            throw new ActionError('Invalid Code');
        }

        if (existingUser.isEmailVerified) {
            throw new ActionError('User is already verified');
        }

        // ? Check if code is valid and match
        const existingCode = await findEmailVerificationByUserIdAndCode(
            existingUser.id,
            parsedInput.code,
        );

        if (!existingCode) {
            throw new ActionError('Invalid Code');
        }

        await deleteEmailVerificationByUserId(existingUser.id);

        await patchUser(
            {
                isEmailVerified: true,
            },
            existingUser.id,
        );
        return {
            message: 'Email verified successfully',
        };
    });

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
