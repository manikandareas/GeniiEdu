import { validateRequest } from '@/common/libs/lucia';
import {
    DEFAULT_SERVER_ERROR_MESSAGE,
    createSafeActionClient,
} from 'next-safe-action';
import { z } from 'zod';

export class ActionError extends Error {}

export const actionProcedure = createSafeActionClient({
    handleReturnedServerError: (e) => {
        if (e instanceof ActionError) {
            return e.message;
        }

        return DEFAULT_SERVER_ERROR_MESSAGE;
    },
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
}).use(async ({ next, clientInput, metadata }) => {
    console.log('LOGGING MIDDLEWARE');

    // Here we await the action execution.
    const result = await next({ ctx: null });

    console.log('Result ->', result);
    console.log('Client input ->', clientInput);
    console.log('Metadata ->', metadata);

    // And then return the result of the awaited action.
    return result;
});

export const authenticatedProcedure = actionProcedure.use(async ({ next }) => {
    const { user, session } = await validateRequest();
    if (!session) {
        throw new ActionError('Unauthorized');
    }

    if (!user) {
        throw new ActionError('Unauthorized');
    }

    // Here we return the context object for the next middleware in the chain/server code function.
    return next({
        ctx: {
            user,
            session,
        },
    });
});

export const teacherProcedure = authenticatedProcedure.use(
    async ({ next, ctx }) => {
        const { user } = ctx;
        if (user.role !== 'teacher') {
            throw new ActionError('Only teachers can create classes');
        }

        return next({ ctx });
    },
);

export const studentProcedure = authenticatedProcedure.use(
    async ({ next, ctx }) => {
        const { user } = ctx;
        if (user.role !== 'student') {
            throw new ActionError('Only students can join classes');
        }

        return next({ ctx });
    },
);
