import {
    getUserClasses,
    GetUserClassesResponse,
} from '@/actions/users.actions';
import { QueryClient, useQuery } from '@tanstack/react-query';

const QUERY_KEY = ['classes'];

export const useUserClassesQuery = (initialData: GetUserClassesResponse) => {
    return useQuery({
        initialData,
        queryKey: QUERY_KEY,
        queryFn: getUserClasses,
    });
};

export const userClassesQuery = () => {
    const queryClient = new QueryClient();

    const prefetch = async () => {
        await queryClient.prefetchQuery({
            queryKey: QUERY_KEY,
            queryFn: getUserClasses,
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
