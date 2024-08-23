import { useQuery } from '@tanstack/react-query';
import { queryStore } from './query-store';

export const useSubmissionQuery = (assignmentId: string, userId: string) => {
    return useQuery(queryStore.submission.userSubmitted(assignmentId, userId));
};

export const useStudentSubmissionsQuery = (assignmentId: string) => {
    return useQuery(queryStore.submission.studentsSubmission(assignmentId));
};
