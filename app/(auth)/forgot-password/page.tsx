import { Metadata } from 'next';

import RetroGrid from '@/common/components/ui/retro-grid';
import ForgotPassword from './_components/forgot-password';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Authentication forms built using the components.',
};

const ForgotPasswordPage = () => {
    return (
        <main className='relative flex h-screen items-center justify-center px-2 md:px-0'>
            <RetroGrid />
            <ForgotPassword />
        </main>
    );
};

export default ForgotPasswordPage;
