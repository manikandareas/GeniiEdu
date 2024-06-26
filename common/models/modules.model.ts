import { z } from 'zod';

export const createModuleSchema = z.object({
    moduleName: z.string().min(6, 'Module name must be at least 6 characters'),
    description: z
        .string()
        .min(6, 'Class description must be at least 6 characters'),
    slug: z
        .string()
        .max(50, 'Slug must be at most 50 characters long')
        // .regex(
        //     /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/,
        //     'Slug must only contain lowercase letters, numbers, underscores, or hyphens, and must not start or end with special characters',
        // )
        .optional(),
});
