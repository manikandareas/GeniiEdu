import { useSession } from '../components/providers/SessionProvider';

const useCurrentRole = () => {
    const { user } = useSession();

    return user?.role;
};

export default useCurrentRole;
