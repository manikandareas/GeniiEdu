import { z } from 'zod';

export const sendPersonalCommentValidation = z.object({
    comment: z.string().min(1, 'Comment cannot be empty'),
    studentId: z.string(),
    assignmentId: z.string(),
});
