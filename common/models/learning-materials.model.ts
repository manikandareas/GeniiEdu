import { z } from 'zod';
import { FilesTypeEnum } from './schema.model';
import { createSelectSchema } from 'drizzle-zod';
import { Schema } from '.';

export const insertLearningMaterialsSchema = z.object({
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

// title: string;
// content: string;
// authorId: string;
// classId: string;
// id?: string | undefined;
// createdAt?: Date | null | undefined;
// updatedAt?: Date | null | undefined;
// publishedAt?: Date | undefined;
