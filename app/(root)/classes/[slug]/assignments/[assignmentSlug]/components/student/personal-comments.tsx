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
import { InferResultType } from '@/common/data-access/types';
import { usePersonalCommentsQuery } from '@/common/hooks/personal-comments-query';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { pusherClient } from '@/common/libs/Pusher';
import { cn, toPusherKey } from '@/common/libs/utils';
import { useQueryClient } from '@tanstack/react-query';
import { SendHorizonal, User2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { toast } from 'sonner';

export type Messages = InferResultType<'messages'>;

export namespace PersonalComments {
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
    // FIXME: This is a bug, the data is not auto updated (subscribe to pusher) && not displayed
    const { data, isLoading } = usePersonalCommentsQuery({
        assignmentId,
        // if user.role === 'student' then user.id else studentId
        // studentId will not be null if user.role === 'teacher'
        studentId: studentId || user.id,
    });
    const defaultId = 'default';
    const queryClient = useQueryClient();

    // const [incomingMessages, setIncomingMessages] = useState<Messages[]>(
    //     initialData?.messages!,
    // );

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
                toast.error(error.serverError);
            },
        },
    );

    const onSendClicked = () => {
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

        pusherClient.bind('incoming-message', (message: Messages) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'personal-comments',
                    assignmentId,
                    studentId || user.id,
                ],
            });
        });
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
                <Comments messages={data?.messages} />
                <div className='flex items-center gap-2'>
                    <Input
                        id='commentInput'
                        placeholder='Add a comment for your teacher...'
                    />
                    <Button
                        onClick={onSendClicked}
                        disabled={isExecuting}
                        variant={'ghost'}
                        size={'icon'}
                    >
                        <SendHorizonal size={16} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
export default PersonalComments;

type CommentsProps = {
    messages?: Messages[];
};
export const Comments: React.FC<CommentsProps> = ({ messages }) => {
    const user = useCurrentUser()!;

    useEffect(() => {
        const commentContainer = document.getElementById('commentContainer');
        commentContainer?.scrollTo({
            top: commentContainer.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    if (!messages || messages.length === 0) return null;
    return (
        <div
            id='commentContainer'
            className='max-h-[40vh] space-y-2 overflow-y-scroll'
        >
            {messages.map((item, i) => (
                <div
                    key={i}
                    data-index={i}
                    className={cn(
                        'w-fit max-w-[80%] rounded-md bg-muted px-4 py-2',
                        {
                            'ml-auto bg-primary': user.id === item.senderId,
                        },
                    )}
                >
                    {item.content}
                </div>
            ))}
        </div>
    );
};
