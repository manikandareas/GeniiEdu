import { Metadata } from 'next';

import RetroGrid from '@/app/_components/ui/retro-grid';

import { validateRequest } from '@/app/_libs/lucia';
import { redirect } from 'next/navigation';
import Login from './_components/login';
import { Env } from '@/app/_libs/env';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Authentication forms built using the components.',
};

const LoginPage = async () => {
    const { session } = await validateRequest();
    if (session) {
        return redirect(Env.NEXT_PUBLIC_AUTH_ROOT_PAGE);
    }
    return (
        <main className='flex h-screen items-center justify-center px-2 md:px-0'>
            <RetroGrid />
            <Login />
        </main>
    );
};

export default LoginPage;
