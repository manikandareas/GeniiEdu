import { useSession } from '../_providers/session-provider';

const useCurrentUser = () => {
    const { user } = useSession();
    return user;
};

export default useCurrentUser;
