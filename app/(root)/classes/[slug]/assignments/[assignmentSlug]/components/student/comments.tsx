'use client';
import { InferResultType } from '@/common/data-access/types';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { cn } from '@/common/libs/utils';
import { useEffect } from 'react';

namespace Comments {
    export type Props = {
        comments: InferResultType<'messages'>[];
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

export default Comments;
