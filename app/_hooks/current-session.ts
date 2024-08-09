import { useSession } from '@/app/_providers/session-provider';

const useCurrentSession = () => {
    const { session } = useSession();

    return session;
};

export default useCurrentSession;
