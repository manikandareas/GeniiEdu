'use client';

import { useSession } from '../providers/SessionProvider';

type ClientTestProps = {};

const ClientTest: React.FC<ClientTestProps> = () => {
    const { user } = useSession();
    return <div>{JSON.stringify(user)}</div>;
};
export default ClientTest;
