'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const useUserNotificationsQuery = () => {
    const queryClient = useQueryClient();
    const queryResult = useQuery(queryStore.user.notifications);

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: queryStore.user.notifications.queryKey,
        });
    };

    return {
        ...queryResult,
        invalidate,
        queryClient,
    };
};
