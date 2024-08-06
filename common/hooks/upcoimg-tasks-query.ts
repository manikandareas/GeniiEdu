'use client';
import { getUpcomingTasks } from '@/actions/classes.actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useUpcomingTasksQuery = (classId: string) => {
    const QUERY_KEY = ['upcoming-tasks', classId];
    const queryClient = useQueryClient();
    const queryResult = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => getUpcomingTasks(classId),
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
