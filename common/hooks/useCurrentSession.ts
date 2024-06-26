import { useSession } from '../components/providers/SessionProvider';

const useCurrentSession = () => {
    const { session } = useSession();

    return session;
};

export default useCurrentSession;
