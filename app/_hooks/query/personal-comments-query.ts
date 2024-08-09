import { getPersonalComments } from '@/app/_actions/personal-comments-actions';
import { useQuery } from '@tanstack/react-query';

export const usePersonalCommentsQuery = ({
    assignmentId,
    studentId,
}: {
    assignmentId: string;
    studentId: string;
}) => {
    return useQuery({
        queryKey: ['personal-comments', assignmentId, studentId],
        queryFn: () =>
            getPersonalComments({
                assignmentId,
                studentId,
            }),
    });
};
