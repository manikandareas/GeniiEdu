import { z } from 'zod';
import { FilesTypeEnum } from '../_libs/db/schema';
export const addSubmissionValidation = z.object({
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

export const submitGradesValidation = z.array(
    z.object({
        grade: z.number(),
        id: z.string(),
    }),
);
