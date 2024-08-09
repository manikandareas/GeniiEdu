import { QueryClient, useQuery } from '@tanstack/react-query';
import { FindDetailsAssignmentResponse } from '@/app/_data-access/assignments';
import { getDetailsAssignment } from '@/app/_actions/assignments-actions';

type DetailsAssignmentQueryProps = {
    assignmentId: string;
    userId: string;
};

export const useDetailsAssignmentQuery = (
    initialData: FindDetailsAssignmentResponse,
    props: DetailsAssignmentQueryProps,
) => {
    return useQuery({
        initialData,
        queryKey: ['details-assignment', props.assignmentId, props.userId],
        queryFn: () => {
            return getDetailsAssignment({
                id: props.assignmentId,
                userId: props.userId,
            });
        },
    });
};

export const detailsAssignmentQuery = (props: DetailsAssignmentQueryProps) => {
    const queryClient = new QueryClient();

    const QUERY_KEY = ['details-assignment', props.assignmentId, props.userId];

    const prefetch = async () => {
        await queryClient.prefetchQuery({
            queryKey: QUERY_KEY,
            queryFn: () =>
                getDetailsAssignment({
                    id: props.assignmentId,
                    userId: props.userId,
                }),
        });
    };

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: QUERY_KEY,
        });
    };

    return {
        prefetch,
        queryClient,
        invalidate,
    };
};
