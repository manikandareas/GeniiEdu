import { QueryClient, useQuery } from '@tanstack/react-query';
import { GetDetailsAssignmentResponse } from '@/app/_actions/assignments-actions';
import { queryStore } from './query-store';

type DetailsAssignmentQueryProps = {
    assignmentId: string;
};

export const useDetailsAssignmentQuery = (
    initialData: GetDetailsAssignmentResponse,
    props: DetailsAssignmentQueryProps,
) => {
    return useQuery({
        initialData,
        ...queryStore.assignment.details(props.assignmentId),
    });
};

export const detailsAssignmentQuery = (props: DetailsAssignmentQueryProps) => {
    const queryClient = new QueryClient();

    const prefetch = async () => {
        await queryClient.prefetchQuery(
            queryStore.assignment.details(props.assignmentId),
        );
    };

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: queryStore.assignment.details(props.assignmentId)
                .queryKey,
        });
    };

    return {
        prefetch,
        queryClient,
        invalidate,
    };
};
