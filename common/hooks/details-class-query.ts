import {
    getDetailsClass,
    GetDetailsClassResponse,
} from '@/actions/classes.actions';
import { QueryClient, useQuery } from '@tanstack/react-query';

export const useDetailsClassQuery = (
    initialData: GetDetailsClassResponse,
    classSlug: string,
) => {
    return useQuery({
        initialData,
        queryKey: ['details-class', classSlug],
        queryFn: () => getDetailsClass(classSlug),
    });
};

export const detailsClassQuery = (classSlug: string) => {
    const queryClient = new QueryClient();

    const QUERY_KEY = ['details-class', classSlug];

    const prefetch = async () => {
        await queryClient.prefetchQuery({
            queryKey: QUERY_KEY,
            queryFn: () => getDetailsClass(classSlug),
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
