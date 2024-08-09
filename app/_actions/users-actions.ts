'use server';

import { findMemberClasses } from '@/app/_data-access/class-members';
import { findUserByEmail, patchUser } from '@/app/_data-access/users';
import { validateRequest } from '@/app/_libs/lucia';
import {
    ActionError,
    actionProcedure,
    authenticatedProcedure,
} from '@/app/_libs/safe-action';
import {
    onboardingValidation,
    updateAccountValidation,
    updateProfileValidation,
} from '@/app/_validations/users-validation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import * as argon from 'argon2';
import { findUserNotifications } from '@/app/_data-access/notifications';

/**
 * Handles the onboarding profile process for a user.
 *
 * @param values - The values submitted for the onboarding profile.
 * @returns A promise that resolves to an object with the following properties:
 *   - success: A boolean indicating if the onboarding profile was successful.
 *   - message: A string message indicating the result of the onboarding profile.
 *   - error: A string containing the error message if the onboarding profile failed.
 */
export const onboardingProfile = async (
    values: z.infer<typeof onboardingValidation>,
) => {
    try {
        onboardingValidation.parse(values);
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }

    try {
        const { user } = await validateRequest();

        if (!user) {
            return redirect('/login');
        }

        const response = await patchUser(
            {
                name: values.name,
                username: values.username,
                role: values.role,
                onBoardingComplete: true,
                updatedAt: new Date(),
            },
            user.id,
        );

        if (response.length === 0) {
            return {
                success: false,
                error: 'User not found',
            };
        }

        return {
            success: true,
            message: 'Success adding information',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Schema for checking if an email exists.
 */
const isEmailExistSchema = z.object({
    email: z.string().email(),
});
/**
 * Checks if an email already exists in the system.
 *
 * @param parsedInput - The parsed input containing the email to check.
 * @returns A promise that resolves to an object with the success status and data.
 */
export const isEmailExist = actionProcedure
    .metadata({ actionName: 'isEmailExist' })
    .schema(isEmailExistSchema)
    .action(async ({ parsedInput }) => {
        const existingUser = findUserByEmail(parsedInput.email);

        if (!existingUser) {
            return {
                data: false,
            };
        }

        return {
            data: true,
        };
    });

export type GetUserClassesFilter = 'ongoing' | 'completed' | 'archived' | null;

/**
 * Retrieves the classes associated with the user.
 * @returns A promise that resolves to an object containing the classes and metadata.
 * @throws An error if the user is unauthorized or if an error occurs during the retrieval process.
 */
export const getUserClasses = async () => {
    const { user } = await validateRequest();

    if (!user) {
        throw new ActionError('Unauthorized');
    }

    const userClasses = await findMemberClasses(user.id);

    if (userClasses.length === 0) {
        revalidatePath('/classes');
        return {
            data: {
                classes: [],
                metadata: {
                    total: 0,
                    ongoing: 0,
                    completed: 0,
                    archived: 0,
                },
            },
        };
    }

    const metadata = userClasses.reduce(
        (acc, curr) => {
            if (curr.statusCompletion === 'ongoing') {
                acc.ongoing += 1;
            } else if (curr.statusCompletion === 'completed') {
                acc.completed += 1;
            } else if (curr.statusCompletion === 'archived') {
                acc.archived += 1;
            }
            return acc;
        },
        {
            total: userClasses.length,
            ongoing: 0,
            completed: 0,
            archived: 0,
        },
    );

    revalidatePath('/classes');

    return {
        data: {
            classes: userClasses,
            metadata,
        },
    };
};

export type GetUserClassesResponse = Awaited<ReturnType<typeof getUserClasses>>;

export const updateUserProfile = authenticatedProcedure
    .metadata({
        actionName: 'updateUserProfile',
    })
    .schema(updateProfileValidation)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx;

        const response = await patchUser(
            {
                username: parsedInput.username,
                email: parsedInput.email,
                bio: parsedInput.bio,
            },
            user.id,
        );

        if (response.length === 0) {
            throw new ActionError('User not found');
        }

        return {
            message: 'Profile updated successfully',
        };
    });

export const updateUserAccount = authenticatedProcedure
    .metadata({
        actionName: 'updateUserAccount',
    })
    .schema(updateAccountValidation)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx;
        let response;

        const userWithPassword = await findUserByEmail(user.email);

        if (!userWithPassword) {
            throw new ActionError('User not found');
        }

        // ? Check if the new password and confirm password match
        // ? Do Update if they match
        if (
            parsedInput.newPassword &&
            parsedInput.confirmPassword &&
            parsedInput.currentPassword
        ) {
            if (parsedInput.newPassword !== parsedInput.confirmPassword) {
                throw new ActionError('Passwords do not match');
            }

            const isPasswordMatch = await argon.verify(
                userWithPassword.passwordHash as string,
                parsedInput.currentPassword,
            );

            if (!isPasswordMatch) {
                throw new ActionError('Incorrect password');
            }

            response = await patchUser(
                {
                    passwordHash: await argon.hash(parsedInput.newPassword),
                    name: parsedInput.name,
                },
                user.id,
            );
        } else {
            response = await patchUser(
                {
                    name: parsedInput.name,
                },
                user.id,
            );
        }

        return {
            message: 'Account updated successfully',
        };
    });

export const getUserNotifications = async () => {
    const { user } = await validateRequest();
    if (!user) {
        throw new ActionError('Unauthorized');
    }

    return findUserNotifications(user.id);
};

export type GetUserNotificationsResponse = Awaited<
    ReturnType<typeof getUserNotifications>
>;
