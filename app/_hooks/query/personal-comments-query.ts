'use client';
import { useQuery } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const usePersonalCommentsQuery = ({
    assignmentId,
    studentId,
}: {
    assignmentId: string;
    studentId: string;
}) => {
    return useQuery(queryStore.personalComment.get(assignmentId, studentId));
};
