import { useSession } from '../components/providers/SessionProvider';

const useCurrentUser = () => {
    const { user } = useSession();
    return user;
};

export default useCurrentUser;
