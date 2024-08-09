import { z } from 'zod';
import { FilesTypeEnum } from '../_libs/db/schema';
import { createSelectSchema } from 'drizzle-zod';
import * as Schema from '../_libs/db/schema';

export const addMaterialValidation = z.object({
    title: z.string().min(6, 'Title must be at least 6 characters'),
    content: z.string().min(6, 'Content must be at least 6 characters'),
    files: z
        .array(
            z.object({
                url: z.string(),
                key: z.string(),
                type: z.enum(FilesTypeEnum.enumValues),
                id: z.string(),
                name: z.string(),
            }),
        )
        .optional(),
    publishedAt: z.date().default(new Date()),
});

export const selectLearningMaterials = createSelectSchema(
    Schema.learningMaterials,
);
