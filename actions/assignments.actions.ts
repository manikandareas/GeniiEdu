'use server';

import {
    findDetailsAssignment,
    insertAssignment,
    patchAssignment,
} from '@/common/data-access/assignments';
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

type GetDetailsAssignmentProps = {
    id: string;
    userId: string;
};

export const getDetailsAssignment = async (
    properties: GetDetailsAssignmentProps,
) => {
    const response = await findDetailsAssignment({
        id: properties.id,
        userId: properties.userId,
    });

    if (!response) {
        throw new ActionError('Assignment not found');
    }

    return response;
};

export const toggleAssignmentStatus = teacherProcedure
    .metadata({
        actionName: 'toggleAssignmentStatus',
    })
    .schema(z.string())
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx;

        const assignment = await findDetailsAssignment({
            id: parsedInput,
            userId: user.id,
        });

        if (!assignment) {
            throw new ActionError('Assignment not found');
        }

        const updatedAssignment = patchAssignment({
            id: parsedInput,
            isOpen: !assignment.isOpen,
        });

        if (!updatedAssignment) {
            throw new ActionError('Failed to toggle assignment status');
        }

        return {
            message: 'Assignment status toggled successfully',
        };
    });

    