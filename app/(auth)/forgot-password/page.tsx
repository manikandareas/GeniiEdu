import { Metadata } from 'next';

import ForgotPassword from '@/common/components/elements/ForgotPassword';
import RetroGrid from '@/common/components/ui/retro-grid';

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
