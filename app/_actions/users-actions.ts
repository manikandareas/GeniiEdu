'use server';

import classMembersData from '@/app/_data-access/class-members';
import usersData from '@/app/_data-access/users';
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
import notificationsData from '@/app/_data-access/notifications';

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

        const response = await usersData.patch({
            id: user.id,
            name: values.name,
            username: values.username,
            role: values.role,
            onBoardingComplete: true,
            updatedAt: new Date(),
        });

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
        const existingUser = usersData.findByEmail(parsedInput.email);

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

    const userClasses = await classMembersData.findMany(user.id);

    if (userClasses.length === 0) {
        revalidatePath('/classes');
        return {
            data: {
                classes: [],
                metadata: {
                    all: 0,
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
            all: userClasses.length,
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

        const response = await usersData.patch({
            id: user.id,
            username: parsedInput.username,
            email: parsedInput.email,
            bio: parsedInput.bio,
        });

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

        const userWithPassword = await usersData.findByEmail(user.email);

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

            response = await usersData.patch({
                id: user.id,
                passwordHash: await argon.hash(parsedInput.newPassword),
                name: parsedInput.name,
            });
        } else {
            response = await usersData.patch({
                id: user.id,
                name: parsedInput.name,
            });
        }

        return {
            message: 'Account updated successfully',
        };
    });

export const getUserNotifications = async () => {
    console.log('Getting notifications');

    const { user } = await validateRequest();
    if (!user) {
        throw new ActionError('Unauthorized');
    }

    console.log('Getting notifications for user:', user.id);

    return notificationsData.findManyWhereUserId(user.id);
};

export type GetUserNotificationsResponse = Awaited<
    ReturnType<typeof getUserNotifications>
>;
