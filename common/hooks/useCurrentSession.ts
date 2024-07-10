import { useSession } from '../components/providers/session-provider';

const useCurrentSession = () => {
    const { session } = useSession();

    return session;
};

export default useCurrentSession;
