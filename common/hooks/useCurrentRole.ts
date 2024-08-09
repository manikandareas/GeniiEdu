import { useSession } from '../components/providers/session-provider';

const useCurrentRole = () => {
    const { user } = useSession();

    return user?.role;
};

export default useCurrentRole;
