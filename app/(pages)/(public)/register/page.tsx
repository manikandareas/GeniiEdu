import { Metadata } from 'next';
import RetroGrid from '@/app/_components/ui/retro-grid';
import { validateRequest } from '@/app/_libs/lucia';
import { redirect } from 'next/navigation';
import Register from './_components/register';
import { Env } from '@/app/_libs/env';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Authentication forms built using the components.',
};

const RegisterPage = async () => {
    const { session } = await validateRequest();
    if (session) {
        return redirect(Env.NEXT_PUBLIC_AUTH_ROOT_PAGE);
    }
    return (
        <main className='flex h-screen items-center justify-center px-2 md:px-0'>
            <RetroGrid />
            <Register />
        </main>
    );
};

export default RegisterPage;
