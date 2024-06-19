import { Metadata } from 'next';

import RetroGrid from '@/common/components/ui/retro-grid';
import ForgotPassword from './_components/ForgotPassword';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Authentication forms built using the components.',
};

const ForgotPasswordPage = () => {
    return (
        <main className='relative flex h-screen items-center justify-center'>
            <RetroGrid />
            <ForgotPassword />
        </main>
    );
};

export default ForgotPasswordPage;
