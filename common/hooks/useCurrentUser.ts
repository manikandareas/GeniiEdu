import { useSession } from '../components/providers/session-provider';

const useCurrentUser = () => {
    const { user } = useSession();
    return user;
};

export default useCurrentUser;
