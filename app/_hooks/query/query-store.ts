import { getDetailsAssignment } from '@/app/_actions/assignments-actions';
import {
    getDetailsClass,
    getUpcomingTasks,
} from '@/app/_actions/classes-actions';
import { getPersonalComments } from '@/app/_actions/personal-comments-actions';
import {
    getUserClasses,
    getUserNotifications,
} from '@/app/_actions/users-actions';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryStore = createQueryKeyStore({
    user: {
        notifications: {
            queryKey: ['user-notifications'],
            queryFn: getUserNotifications,
        },
        classes: {
            queryKey: ['user-classes'],
            queryFn: getUserClasses,
        },
    },
    class: {
        details: (slug: string) => ({
            queryKey: ['details-class', slug],
            queryFn: () => getDetailsClass(slug),
        }),
        upcomingTasks: (classId: string) => ({
            queryKey: ['upcoming-tasks', classId],
            queryFn: () => getUpcomingTasks(classId),
        }),
    },

    assignment: {
        details: (assignmentId: string) => ({
            queryKey: ['details-assignment', assignmentId],
            queryFn: () =>
                getDetailsAssignment({
                    id: assignmentId,
                }),
        }),
    },

    subbmission: {},

    personalComment: {
        get: (assignmentId: string, studentId: string) => ({
            queryKey: ['personal-comments', assignmentId, studentId],
            queryFn: () =>
                getPersonalComments({
                    assignmentId,
                    studentId,
                }),
        }),
    },
});
