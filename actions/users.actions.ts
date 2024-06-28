'use server';

import db from '@/common/libs/DB';
import { validateRequest } from '@/common/libs/lucia';
import { Schema } from '@/common/models';
import { UsersModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { actionProcedure } from '.';

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

        const response = await db
            .update(Schema.users)
            .set({
                name: values.name,
                username: values.username,
                role: values.role,
                onBoardingComplete: true,
                updatedAt: new Date(),
            })
            .where(eq(Schema.users.id, user.id));

        if (response.count === 0) {
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

const isEmailExistSchema = z.object({
    email: z.string().email(),
});
export const isEmailExist = actionProcedure
    .metadata({ actionName: 'findUserByEmail' })
    .schema(isEmailExistSchema)
    .action(async ({ parsedInput }) => {
        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(Schema.users.email, parsedInput.email),
            });

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

export const getStudentClasses = async () => {
    const { user } = await validateRequest();

    if (!user) {
        throw new Error('Unauthorized');
    }

    try {
        const userClasses = await db.query.classMembers.findMany({
            where: eq(Schema.classMembers.userId, user.id),
            with: {
                class: {
                    with: {
                        teacher: true,
                    },
                },
            },
        });

        if (userClasses.length === 0) {
            return {
                success: true,
                data: {
                    classes: [],
                    metadata: {
                        all: 0,
                        ongoing: 0,
                        completed: 0,
                        archived: 0,
                    },
                },
                message: "You don't have any classes 😢",
            } satisfies ActRes;
        }

        return {
            success: true,
            data: {
                classes: userClasses,
                metadata: {
                    all: userClasses.length,
                    ongoing: userClasses.filter(
                        (classMember) =>
                            classMember.statusCompletion === 'ongoing',
                    ).length,
                    completed: userClasses.filter(
                        (classMember) =>
                            classMember.statusCompletion === 'completed',
                    ).length,
                    archived: userClasses.filter(
                        (classMember) =>
                            classMember.statusCompletion === 'archived',
                    ).length,
                },
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        } satisfies ActRes;
    }
};

export const getTeacherClasses = async () => {
    const { user } = await validateRequest();

    if (!user) {
        throw new Error('Unauthorized');
    }

    if (user.role !== 'teacher') {
        throw new Error('Unauthorized');
    }

    try {
        const teacherClasses = await db.query.classes.findMany({
            where: eq(Schema.classes.teacherId, user.id),
            with: {
                teacher: true,
            },
        });

        if (teacherClasses.length === 0) {
            return {
                success: true,
                data: {
                    classes: [],
                    metadata: {
                        all: 0,
                        ongoing: 0,
                        completed: 0,
                        archived: 0,
                    },
                },
                message: "You don't have any classes 😢",
            } satisfies ActRes;
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        };
    }
};
