import { z } from 'zod';

export const onboardingSchema = z.object({
    name: z.string().min(6),
    username: z.string().min(6),
    role: z.enum(['teacher', 'student']),
});
