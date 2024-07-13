import { z } from 'zod';
import { FilesTypeEnum } from './schema.model';

export const createAssignmentSchema = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.date().min(new Date()),
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

// description: string;
// title: string;
// authorId: string;
// dueDate: Date;
// classId: string;
// id?: string | undefined;
// createdAt?: Date | null | undefined;
// updatedAt?: Date | null | undefined;
// filePath?: string | ... 1 more ... | undefined;
// isOpen?: boolean | undefined;
// publishedAt?: Date | undefined;
