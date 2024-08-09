'use server';

import {
    createAssignmentPersonalComment,
    findAssignmentPersonalComments,
    insertPersonalComment,
} from '@/app/_data-access/personal-comments';
import { pusherServer } from '@/app/_libs/pusher';
import { ActionError, authenticatedProcedure } from '@/app/_libs/safe-action';
import { toPusherKey } from '@/app/_utilities';
import { sendPersonalCommentValidation } from '@/app/_validations/personal-comments-validation';

export const sendPersonalComment = authenticatedProcedure
    .metadata({
        actionName: 'sendPersonalComment',
    })
    .schema(sendPersonalCommentValidation)
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
            throw new ActionError('Failed to send comment');
        }

        return {
            message: 'Comment sent successfully',
        };
    });

type GetPersonalComments = {
    studentId: string;
    assignmentId: string;
};
export const getPersonalComments = async (props: GetPersonalComments) => {
    const response = await findAssignmentPersonalComments({
        assignmentId: props.assignmentId,
        studentId: props.studentId,
    });

    if (!response) {
        throw new ActionError('Failed to get personal comments');
    }
    return response;
};
