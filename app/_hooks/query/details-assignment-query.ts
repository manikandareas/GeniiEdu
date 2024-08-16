import { QueryClient, useQuery } from '@tanstack/react-query';
import {
    getDetailsAssignment,
    GetDetailsAssignmentResponse,
} from '@/app/_actions/assignments-actions';

type DetailsAssignmentQueryProps = {
    assignmentId: string;
};

export const useDetailsAssignmentQuery = (
    initialData: GetDetailsAssignmentResponse,
    props: DetailsAssignmentQueryProps,
) => {
    return useQuery({
        initialData,
        queryKey: ['details-assignment', props.assignmentId],
        queryFn: () => {
            return getDetailsAssignment({
                id: props.assignmentId,
            });
        },
    });
};

export const detailsAssignmentQuery = (props: DetailsAssignmentQueryProps) => {
    const queryClient = new QueryClient();

    const QUERY_KEY = ['details-assignment', props.assignmentId];

    const prefetch = async () => {
        await queryClient.prefetchQuery({
            queryKey: QUERY_KEY,
            queryFn: () =>
                getDetailsAssignment({
                    id: props.assignmentId,
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
