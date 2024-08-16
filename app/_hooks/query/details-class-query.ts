import { GetDetailsClassResponse } from '@/app/_actions/classes-actions';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const useDetailsClassQuery = (
    initialData: GetDetailsClassResponse,
    classSlug: string,
) => {
    return useQuery({
        initialData,
        ...queryStore.class.details(classSlug),
    });
};

export const detailsClassQuery = (classSlug: string) => {
    const queryClient = new QueryClient();

    const prefetch = async () => {
        await queryClient.prefetchQuery(queryStore.class.details(classSlug));
    };

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: queryStore.class.details(classSlug).queryKey,
        });
    };

    return {
        prefetch,
        queryClient,
        invalidate,
    };
};
