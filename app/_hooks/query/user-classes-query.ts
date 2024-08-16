import { GetUserClassesResponse } from '@/app/_actions/users-actions';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const useUserClassesQuery = (initialData: GetUserClassesResponse) => {
    return useQuery({
        initialData,
        ...queryStore.user.classes,
    });
};

export const userClassesQuery = () => {
    const queryClient = new QueryClient();

    const prefetch = async () => {
        await queryClient.prefetchQuery(queryStore.user.classes);
    };

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: queryStore.user.classes.queryKey,
        });
    };

    return {
        prefetch,
        queryClient,
        invalidate,
    };
};
