import { Metadata } from 'next';

import Register from '@/common/components/elements/Register';
import RetroGrid from '@/common/components/ui/retro-grid';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Authentication forms built using the components.',
};

const RegisterPage = async () => {
    const { session } = await validateRequest();
    if (session) {
        return redirect('/');
    }
    return (
        <main className='flex h-screen items-center justify-center'>
            <RetroGrid />
            <Register />
        </main>
    );
};

export default RegisterPage;
