import { Metadata } from 'next';

import RetroGrid from '@/common/components/ui/retro-grid';
import Login from '@/common/components/elements/Login';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Authentication forms built using the components.',
};

const LoginPage = async () => {
    const { session } = await validateRequest();
    if (session) {
        return redirect('/');
    }
    return (
        <main className='flex h-screen items-center justify-center'>
            <RetroGrid />
            <Login />
        </main>
    );
};

export default LoginPage;
