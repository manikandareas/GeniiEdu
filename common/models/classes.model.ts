import { z } from 'zod';

export const createClassSchema = z.object({
    className: z.string().min(6, 'Class name must be at least 6 characters'),
    classCode: z.string().min(6, 'Class code must be at least 6 characters'),
    description: z
        .string()
        .min(6, 'Class description must be at least 6 characters'),
    accessType: z.enum(['public', 'private']).default('private'),
    thumbnail: z.string().url().optional(),
    slug: z
        .string()
        .max(50, 'Slug must be at most 50 characters long')
        // .regex(
        //     /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/,
        //     'Slug must only contain lowercase letters, numbers, underscores, or hyphens, and must not start or end with special characters',
        // )
        .optional(),

    thumbnailKey: z.string().optional(),
});

export const joinClassSchema = z.object({
    classCode: z
        .string()
        .min(6, 'Invitation code must be at least 6 characters'),
});

export const addModuleSchema = z.object({
    moduleId: z.string().min(6, 'Module ID must be at least 6 characters'),
    classId: z.string().min(6, 'Class ID must be at least 6 characters'),
    publishedAt: z.string().optional(),
});
