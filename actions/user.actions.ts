'use server';

import db from '@/common/libs/DB';
import { validateRequest } from '@/common/libs/lucia';
import { users } from '@/common/models/Schema';
import { onboardingSchema } from '@/common/models/User.model';
import { ActRes } from '@/common/types/Action.type';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const onboardingProfile = async (
    values: z.infer<typeof onboardingSchema>,
) => {
    try {
        onboardingSchema.parse(values);
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
            .update(users)
            .set({
                name: values.name,
                username: values.username,
                role: values.role,
                onBoardingComplete: true,
            })
            .where(eq(users.id, user.id));

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
