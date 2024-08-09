import { z } from 'zod';
import { FilesTypeEnum } from '../_libs/db/schema';

export const addAssignmentValidation = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.date().min(new Date()).or(z.null()).optional(),
    publishedAt: z.date().optional(),
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
});
