'use server';

import { findMemberClasses } from '@/common/data-access/class-members';
import { findUserByEmail, patchUser } from '@/common/data-access/users';
import { validateRequest } from '@/common/libs/lucia';
import { actionProcedure } from '@/common/libs/safe-action';
import { UsersModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
    values: z.infer<typeof UsersModel.onboardingSchema>,
) => {
    try {
        UsersModel.onboardingSchema.parse(values);
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        } satisfies ActRes;
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
            } satisfies ActRes;
        }

        return {
            success: true,
            message: 'Success adding information',
        } satisfies ActRes;
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        } satisfies ActRes;
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
        try {
            const existingUser = findUserByEmail(parsedInput.email);

            if (!existingUser) {
                return {
                    success: false,
                    data: false,
                } satisfies ActRes<boolean>;
            }

            return {
                success: true,
                data: true,
            } satisfies ActRes<boolean>;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            } satisfies ActRes;
        }
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
        throw new Error('Unauthorized');
    }

    try {
        const userClasses = await findMemberClasses(user.id);

        if (userClasses.length === 0) {
            revalidatePath('/classes');
            return {
                success: true,
                data: {
                    classes: [],
                    metadata: {
                        total: 0,
                        ongoing: 0,
                        completed: 0,
                        archived: 0,
                    },
                },
            } satisfies ActRes;
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
            success: true,
            data: {
                classes: userClasses,
                metadata,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        } satisfies ActRes;
    }
};

export type GetUserClassesResponse = Awaited<ReturnType<typeof getUserClasses>>;
