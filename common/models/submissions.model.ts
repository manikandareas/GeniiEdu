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

// classId: string;
// assignmentId: string;
// studentId: string;
// id?: string | undefined;
// updatedAt?: Date | null | undefined;
// isGraded?: boolean | undefined;
// grade?: string | null | undefined;
// submittedAt?: Date | undefined;
