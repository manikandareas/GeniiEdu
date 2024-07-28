'use client';
import { sendPersonalComment } from '@/actions/assignments.actions';
import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { usePersonalCommentsQuery } from '@/common/hooks/personal-comments-query';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { pusherClient } from '@/common/libs/Pusher';
import { toPusherKey } from '@/common/libs/utils';
import { useQueryClient } from '@tanstack/react-query';
import { SendHorizonal, User2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Comments from './comments';
import { Skeleton } from '@/common/components/ui/skeleton';

namespace PersonalComments {
    export type Props = {
        assignmentId: string;
        studentId?: string;
    };
}

const PersonalComments: React.FC<PersonalComments.Props> = ({
    assignmentId,
    studentId,
}) => {
    const user = useCurrentUser()!;
    const { data, isLoading } = usePersonalCommentsQuery({
        assignmentId,
        // if user.role === 'student' then user.id else studentId
        // studentId will not be null if user.role === 'teacher'
        studentId: studentId || user.id,
    });
    const defaultId = 'default';
    const queryClient = useQueryClient();

    // const [incomingMessages, setIncomingMessages] = useState<
    //     Comments.Props['comments']
    // >(data?.messages ?? []);

    const { executeAsync: executeSendPersonalComment, isExecuting } = useAction(
        sendPersonalComment,
        {
            onSuccess: ({ data }) => {
                toast.success(data?.message);
                const commentInput = document.getElementById(
                    'commentInput',
                ) as HTMLInputElement;
                commentInput.value = '';
            },
            onError: ({ error }) => {
                if (error.serverError) {
                    toast.error(error.serverError);
                    return;
                } else if (
                    error.validationErrors &&
                    error.validationErrors.comment
                ) {
                    toast.error(error.validationErrors.comment._errors);
                    return;
                }
                toast.error('An error occurred');
            },
        },
    );

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const commentInput = document.getElementById(
            'commentInput',
        ) as HTMLInputElement;
        executeSendPersonalComment({
            assignmentId,
            studentId: studentId || user.id,
            comment: commentInput.value,
        });
    };

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(
                `personal_comments:${assignmentId}:${studentId || user.id}` ||
                    defaultId,
            ),
        );

        pusherClient.bind(
            'incoming-message',
            (message: Comments.Props['comments'][number]) => {
                queryClient.invalidateQueries({
                    queryKey: [
                        'personal-comments',
                        assignmentId,
                        studentId || user.id,
                    ],
                });

                // queryClient.setQueryData(
                //     ['personal-comments', assignmentId, studentId || user.id],
                //     [...(data?.messages ?? []), message],
                // );
            },
        );
        // pusherClient.bind('incoming-message', (message: Messages) => {
        //     setIncomingMessages((prev) => [...prev, message]);
        // });

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(
                    `personal_comments:${assignmentId}:${studentId || user.id}` ||
                        defaultId,
                ),
            );
            pusherClient.unbind('incoming-message');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Card>
            <CardHeader className=''>
                <CardTitle className='flex items-center gap-2 text-xl'>
                    <User2 size={20} />
                    <span>Personal Comments</span>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {isLoading && <Skeleton className='h-10 w-full rounded-md' />}
                <Comments comments={data?.messages ?? []} />
                <form onSubmit={onSubmit} className='flex items-center gap-2'>
                    <Input
                        id='commentInput'
                        placeholder='Add a comment for your teacher...'
                    />
                    <Button
                        disabled={isExecuting || isLoading}
                        variant={'outline'}
                        size={'icon'}
                        type='submit'
                    >
                        <SendHorizonal size={16} />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
export default PersonalComments;
