import { z } from 'zod';
import { users } from './schema.model';
import { createSelectSchema } from 'drizzle-zod';
import { isEmailExist } from '@/actions/users.actions';

export const insertUserSchema = z
    .object({
        // username: z.string().min(4, "Username can't be less than 4 characters"),
        email: z.string().email('Please enter a valid email address'),
        // role: z.enum(['teacher', 'student']),
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
export const loginUserSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, "Password can't be less than 8 characters"),
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const verifyEmailSchema = z.object({
    code: z.string().min(6, {
        message: 'Your verification code must be 6 characters.',
    }),
});
