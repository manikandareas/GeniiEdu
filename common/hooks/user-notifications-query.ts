import { getUserNotifications } from '@/actions/users.actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useUserNotificationsQuery = () => {
    const QUERY_KEY = ['notifications'];
    const queryClient = useQueryClient();
    const queryResult = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => getUserNotifications(),
    });

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: QUERY_KEY,
        });
    };

    return {
        ...queryResult,
        invalidate,
        queryClient,
    };
};
