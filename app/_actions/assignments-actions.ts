'use server';

import assignmentsData from '@/app/_data-access/assignments';
import classesData from '@/app/_data-access/classes';
import filesData from '@/app/_data-access/files';
import notificationsData from '@/app/_data-access/notifications';
import { Goreal } from '../_libs/goreal';
import { ActionError, teacherProcedure } from '@/app/_libs/safe-action';
import { addAssignmentValidation } from '@/app/_validations/assignments-validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import classMembersData from '../_data-access/class-members';
import { validateRequest } from '../_libs/lucia';
import { InferResultType } from '../_data-access/types';

export const createAssignment = teacherProcedure
    .metadata({
        actionName: 'createAssignment',
    })
    .bindArgsSchemas<[z.ZodString]>([z.string()])
    .schema(addAssignmentValidation)
    .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [classSlug] }) => {
        const { user } = ctx;

        const existingClass = await classesData.isOwner(user.id, classSlug);

        if (!existingClass) {
            throw new ActionError('You are not the owner of this class');
        }

        const insertedAssignment = await assignmentsData.create({
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
                await filesData
                    .patch(file.id, {
                        assignmentId: insertedAssignment.id,
                    })
                    .catch(() => {
                        throw new ActionError(
                            'Failed to attach files to learning material',
                        );
                    });
            });
        }

        const recipientsNotification = await classMembersData.findIdMembers(
            existingClass.id,
        );

        await notificationsData.createMany(
            recipientsNotification.map((r) => ({
                userId: r,
                title: 'New Assignment added',
                isRead: false,
                message: `New assignment "${parsedInput.title}" has been added to the class "${existingClass.className}"`,
                url: `/classes/${classSlug}`,
            })),
        );

        const goreal = new Goreal(user.id);

        const is_success = await goreal.pushBroadcast({
            event: Goreal.broadcastKey.NOTIFICATION_UPDATED,
            recipients: recipientsNotification,
        });

        if (!is_success) {
            throw new ActionError('Failed to broadcast notification');
        }

        revalidatePath(`/classes/${classSlug}`);

        return {
            message: 'Assignment created successfully',
        };
    });

type GetDetailsAssignmentProps = {
    id: string;
};

export const getDetailsAssignment = async (
    properties: GetDetailsAssignmentProps,
): Promise<GetDetailsAssignmentResponse> => {
    const { user } = await validateRequest();
    if (!user) {
        throw new ActionError('User not found');
    }
    const response = await assignmentsData.findOne(properties.id, {
        queryConfig: {
            with: assignmentsData.W_CLASS_AUTHOR_FILES,
        },
    });

    if (!response) {
        throw new ActionError('Assignment not found');
    }
    return response as unknown as GetDetailsAssignmentResponse;
};

export type GetDetailsAssignmentResponse = InferResultType<
    'assignments',
    typeof assignmentsData.W_CLASS_AUTHOR_FILES
>;

export const toggleAssignmentStatus = teacherProcedure
    .metadata({
        actionName: 'toggleAssignmentStatus',
    })
    .schema(z.string())
    .action(async ({ parsedInput, ctx }) => {
        // const assignment = await assignmentsData.findOne({
        //     id: parsedInput,
        //     userId: user.id,
        // });

        const assignment = await assignmentsData.findOne(parsedInput);

        if (!assignment) {
            throw new ActionError('Assignment not found');
        }

        const updatedAssignment = assignmentsData.patch({
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
