'use server';

import db from '@/common/libs/DB';
import { validateRequest } from '@/common/libs/lucia';
import { Schema } from '@/common/models';
import { UsersModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { actionClient } from '.';

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

        const response = db
            .update(Schema.users)
            .set({
                name: values.name,
                username: values.username,
                role: values.role,
                onBoardingComplete: true,
            })
            .where(eq(Schema.users.id, user.id));

        if ((await response).rowCount === 0) {
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
export const isEmailExist = actionClient
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
