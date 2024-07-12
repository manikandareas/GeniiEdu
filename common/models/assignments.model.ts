import { z } from 'zod';

export const createAssignmentSchema = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.date().min(new Date()),
    filePath: z.string().optional(),
    publishedAt: z.date().optional(),
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
