import { Metadata } from 'next';

import VerifyEmail from '@/common/components/elements/VerifyEmail';
import RetroGrid from '@/common/components/ui/retro-grid';
import { notFound, redirect } from 'next/navigation';
import { isEmailVerified } from '@/actions/auth.actions';
import { toast } from 'sonner';

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Authentication forms built using the components.',
};

type VerifyEmailPageProps = {
    searchParams: {
        email: string;
    };
};

const VerifyEmailPage = async (props: VerifyEmailPageProps) => {
    if (!props.searchParams.email) {
        return notFound();
    }
    // ? Check if email is already verified and exists in the database
    const { data: isVerified, success } = await isEmailVerified(
        props.searchParams.email,
    );

    // ? If user not found or email is't valid
    if (!success) {
        return notFound();
    }

    // ? If email is already verified redirect to login
    if (isVerified) {
        return redirect('/login');
    }

    // ? If email is not verified, send verification email
    return (
        <main className='flex h-screen items-center justify-center'>
            <RetroGrid />
            <VerifyEmail email={props.searchParams.email} />
        </main>
    );
};

export default VerifyEmailPage;
