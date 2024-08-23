import { getDetailsAssignment } from '@/app/_actions/assignments-actions';
import {
    getClassesForSearch,
    getDetailsClass,
    getUpcomingTasks,
} from '@/app/_actions/classes-actions';
import { getPersonalComments } from '@/app/_actions/personal-comments-actions';
import {
    getSubmissionsWhereAssId,
    getSubmissionWhereAssIdAndStudentId,
} from '@/app/_actions/submissions-actions';
import {
    getUserClasses,
    getUserNotifications,
} from '@/app/_actions/users-actions';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryStore = createQueryKeyStore({
    user: {
        notifications: {
            queryKey: null,
            queryFn: () => getUserNotifications(),
        },
        classes: {
            queryKey: null,
            queryFn: () => getUserClasses(),
        },
        globalSearch: (userId: string) => ({
            queryKey: [userId],
            queryFn: () => getClassesForSearch(userId),
        }),
    },
    class: {
        details: (slug: string) => ({
            queryKey: [slug],
            queryFn: () => getDetailsClass(slug),
        }),
        upcomingTasks: (classId: string) => ({
            queryKey: [classId],
            queryFn: () => getUpcomingTasks(classId),
        }),
    },

    assignment: {
        details: (assignmentId: string) => ({
            queryKey: [assignmentId],
            queryFn: () =>
                getDetailsAssignment({
                    id: assignmentId,
                }),
        }),
    },

    submission: {
        userSubmitted: (assignmentId: string, userId: string) => ({
            queryKey: [assignmentId, userId],
            queryFn: () =>
                getSubmissionWhereAssIdAndStudentId(assignmentId, userId),
        }),

        studentsSubmission: (assignmentId: string) => ({
            queryKey: [assignmentId],
            queryFn: () => getSubmissionsWhereAssId(assignmentId),
        }),
    },

    personalComment: {
        get: (assignmentId: string, studentId: string) => ({
            queryKey: [assignmentId, studentId],
            queryFn: () =>
                getPersonalComments({
                    assignmentId,
                    studentId,
                }),
        }),
    },
});
