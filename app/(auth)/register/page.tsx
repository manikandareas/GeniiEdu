import { Metadata } from 'next';
import RetroGrid from '@/common/components/ui/retro-grid';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import Register from './_components/Register';
import { Env } from '@/common/libs/Env';

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
        <main className='flex h-screen items-center justify-center'>
            <RetroGrid />
            <Register />
        </main>
    );
};

export default RegisterPage;
