import { getAssignmentPersonalComments } from '@/actions/assignments.actions';
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
            getAssignmentPersonalComments({
                assignmentId,
                studentId,
            }),
    });
};
