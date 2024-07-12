import { Metadata } from 'next';

import { isEmailVerified } from '@/actions/auth.actions';
import RetroGrid from '@/common/components/ui/retro-grid';
import { notFound, redirect } from 'next/navigation';
import VerifyEmail from './_components/verify-email';

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
    const response = await isEmailVerified(props.searchParams.email);

    if (!response?.data) {
        throw new Error('Something went wrong');
    }

    const { success, data: isVerified } = response.data;

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
        <main className='flex h-screen items-center justify-center px-2 md:px-0'>
            <RetroGrid />
            <VerifyEmail email={props.searchParams.email} />
        </main>
    );
};

export default VerifyEmailPage;
