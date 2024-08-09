'use client';
import Typography from '@/common/components/ui/typography';
import { InferResultType } from '@/common/data-access/types';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { cn, formatDate } from '@/common/libs/utils';
import { useEffect } from 'react';

namespace Comments {
    export type Props = {
        comments: InferResultType<'comments'>[];
    };
}
const Comments: React.FC<Comments.Props> = ({ comments }) => {
    const user = useCurrentUser()!;

    useEffect(() => {
        const commentContainer = document.getElementById('commentContainer');
        commentContainer?.scrollTo({
            top: commentContainer.scrollHeight,
            behavior: 'smooth',
        });
    }, [comments]);

    if (!comments || comments.length === 0) return null;
    return (
        <div
            id='commentContainer'
            className='max-h-[40vh] space-y-2 overflow-y-scroll'
        >
            {comments.map((item, i) => (
                <div
                    key={i}
                    data-index={i}
                    className={cn(
                        'flex w-fit max-w-[80%] flex-col gap-y-1 rounded-md bg-muted px-4 py-2',
                        {
                            'ml-auto items-end bg-primary':
                                user.id === item.senderId,
                        },
                    )}
                >
                    <Typography
                        variant={'p'}
                        className={cn('font-medium', {
                            'text-secondary': user.id === item.senderId,
                        })}
                    >
                        {item.content}
                    </Typography>
                    <span
                        className={cn('text-xs text-muted-foreground', {
                            'text-secondary': user.id === item.senderId,
                        })}
                    >
                        {formatDate(item.createdAt ?? new Date())}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Comments;
