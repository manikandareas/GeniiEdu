import { z } from 'zod';
import { users } from '../_libs/db/schema';
import { createSelectSchema } from 'drizzle-zod';

export const addUserValidation = z
    .object({
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, "Password can't be less than 8 characters")
            .trim(),
        confirmationPassword: z.string().min(8, "Password don't match").trim(),
    })
    .refine((data) => data.password === data.confirmationPassword, {
        message: "Passwords don't match",
        path: ['confirmationPassword'],
    });
// .refine(
//     async (data) => {
//         const res = await isEmailExist({
//             email: data.email,
//         });

//         return res?.data?.data;
//     },
//     {
//         message: 'Email already used',
//         path: ['email'],
//     },
// );

export const selectUserSchema = createSelectSchema(users);
export const userLoginValidation = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, "Password can't be less than 8 characters"),
});

export const resetPasswordValidation = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const verifyEmailValidation = z.object({
    code: z.string().min(6, {
        message: 'Your verification code must be 6 characters.',
    }),
});
