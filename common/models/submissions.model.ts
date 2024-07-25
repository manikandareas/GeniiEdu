import { z } from 'zod';
import { FilesTypeEnum } from './schema.model';

export const createSubmissionSchema = z.object({
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

export const submitGradesSchema = z.array(
    z.object({
        grade: z.number(),
        id: z.string(),
    }),
);
