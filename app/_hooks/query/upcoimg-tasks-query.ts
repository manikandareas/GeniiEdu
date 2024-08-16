'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const useUpcomingTasksQuery = (classId: string) => {
    const queryClient = useQueryClient();
    const queryResult = useQuery(queryStore.class.upcomingTasks(classId));

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: queryStore.class.upcomingTasks(classId).queryKey,
        });
    };

    return {
        ...queryResult,
        invalidate,
        queryClient,
    };
};
