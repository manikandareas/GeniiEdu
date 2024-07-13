'use server';

import { insertAssignment } from '@/common/data-access/assignments';
import { isOwnerOfClass } from '@/common/data-access/classes';
import { patchFiles } from '@/common/data-access/files';
import { ActionError, teacherProcedure } from '@/common/libs/safe-action';
import { AssignmentsModel } from '@/common/models';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createAssignment = teacherProcedure
    .metadata({
        actionName: 'createAssignment',
    })
    .bindArgsSchemas<[z.ZodString]>([z.string()])
    .schema(AssignmentsModel.createAssignmentSchema)
    .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [classSlug] }) => {
        const { user } = ctx;

        const existingClass = await isOwnerOfClass(user.id, classSlug);

        if (!existingClass) {
            throw new ActionError('You are not the owner of this class');
        }

        const insertedAssignment = await insertAssignment({
            authorId: user.id,
            classId: existingClass.id,
            description: parsedInput.description,
            dueDate: parsedInput.dueDate,
            title: parsedInput.title,
            publishedAt: parsedInput.publishedAt,
            isOpen: true,
        });

        if (!insertedAssignment) {
            throw new ActionError('Failed to create assignment');
        }

        // ? Insert learning material files if they exist
        if (parsedInput.files && parsedInput.files.length > 0) {
            parsedInput.files.forEach(async (file) => {
                await patchFiles(file.id, {
                    assignmentId: insertedAssignment.id,
                }).catch(() => {
                    throw new ActionError(
                        'Failed to attach files to learning material',
                    );
                });
            });
        }

        revalidatePath(`/classes/${classSlug}`);

        return {
            message: 'Assignment created successfully',
        };
    });
