'use server';

import {
    createAssignmentPersonalComment,
    findAssignmentPersonalComments,
    findDetailsAssignment,
    insertAssignment,
    insertPersonalComment,
    patchAssignment,
} from '@/common/data-access/assignments';
import { isOwnerOfClass } from '@/common/data-access/classes';
import { patchFiles } from '@/common/data-access/files';
import { pusherServer } from '@/common/libs/Pusher';
import {
    ActionError,
    authenticatedProcedure,
    teacherProcedure,
} from '@/common/libs/safe-action';
import { toPusherKey } from '@/common/libs/utils';
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

export const sendPersonalComment = authenticatedProcedure
    .metadata({
        actionName: 'sendPersonalComment',
    })
    .schema(AssignmentsModel.sendPersonalCommentSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx;

        let room = await findAssignmentPersonalComments({
            assignmentId: parsedInput.assignmentId,
            studentId: parsedInput.studentId,
        });

        if (!room) {
            const createdRoom = await createAssignmentPersonalComment({
                assignmentId: parsedInput.assignmentId,
                studentId: parsedInput.studentId,
            });
            room = {
                ...createdRoom,
                messages: [],
            };
        }

        const insertedComment = await insertPersonalComment({
            senderId: user.id,
            content: parsedInput.comment,
            assignmentPersonalChatId: room.id,
        });

        pusherServer.trigger(
            toPusherKey(
                `personal_comments:${parsedInput.assignmentId}:${parsedInput.studentId || user.id}`,
            ),
            'incoming-message',
            insertedComment,
        );

        if (!insertedComment) {
            throw new ActionError('Failed to send message');
        }

        return {
            message: 'Message sent successfully',
        };
    });

type GetAssignmentPersonalCommentsProps = {
    studentId: string;
    assignmentId: string;
};
export const getAssignmentPersonalComments = async (
    props: GetAssignmentPersonalCommentsProps,
) => {
    const response = await findAssignmentPersonalComments({
        assignmentId: props.assignmentId,
        studentId: props.studentId,
    });

    if (!response) {
        throw new ActionError('Failed to get personal comments');
    }
    return response;
};
