import { z } from 'zod';

export const createAssignmentSchema = z.object({
    description: z.string(),
    title: z.string(),
    filePath: z.string().optional(),
});

// description: string;
// title: string;
// postedById: string;
// id?: string | undefined;
// createdAt?: Date | null | undefined;
// updatedAt?: Date | null | undefined;
// filePath?: string | null | undefined;
