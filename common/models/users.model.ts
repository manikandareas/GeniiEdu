import { z } from 'zod';

export const onboardingSchema = z.object({
    name: z.string().min(6),
    username: z.string().min(6),
    role: z.enum(['teacher', 'student']),
});

export const updateProfileSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        })
        // create regex for username
        .regex(/^[a-zA-Z0-9_]*$/, {
            message:
                'Username must only contain letters, numbers, and underscores.',
        }),
    email: z
        .string({
            required_error: 'Please select an email to display.',
        })
        .email(),
    bio: z.string().max(300).min(4),
});

export const updateAccountSchema = z
    .object({
        name: z.string().min(6).optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword && data.confirmPassword) {
                return data.newPassword === data.confirmPassword;
            }
            return true;
        },
        {
            path: ['confirmPassword', 'newPassword'],
            message: 'Passwords do not match.',
        },
    )
    .refine(
        (data) => {
            if (data.currentPassword && data.newPassword) {
                return data.currentPassword !== data.newPassword;
            }
            return true;
        },
        {
            path: ['newPassword', 'currentPassword'],
            message:
                'New password must be different from the current password.',
        },
    )
    // create refine if currentPassword is not empty, newPassword and confirmPassword must not be empty
    .refine(
        (data) => {
            if (data.currentPassword) {
                return data.newPassword && data.confirmPassword;
            }
            return true;
        },
        {
            path: ['currentPassword'],
            message: 'Please fill in all password fields.',
        },
    );
