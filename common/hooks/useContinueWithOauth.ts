import {
    createGithubAuthorizationURL,
    createGoogleAuthorizationURL,
} from '@/actions/auth.actions';
import { useAction } from 'next-safe-action/hooks';

export type UseContinueWithOauth = {
    provider: 'google' | 'github';
};

const useContinueWithOauth = (opt: UseContinueWithOauth) => {
    const fn = {
        github: createGithubAuthorizationURL,
        google: createGoogleAuthorizationURL,
    };

    const { executeAsync, status } = useAction(fn[opt.provider]);

    const executeFn = async () => {
        const res = await executeAsync({});

        if (!res?.data) throw new Error('Something went wrong');

        window.location.href = res.data;
    };

    return {
        executeFn,
        status,
    };
};

export default useContinueWithOauth;
