import { validateRequest } from '@/app/_libs/lucia';
import { redirect } from 'next/navigation';
import { Dashboard } from './_components/dashboard';
import PageHeader from '@/app/_components/elements/page-header';

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
];

const HomePage = async () => {
    const { user } = await validateRequest();

    if (!user) {
        return redirect('/login');
    }

    if (!user.onBoardingComplete) {
        return redirect('/onboarding');
    }

    return (
        <>
            <PageHeader title='Dashboard' urls={urls} />
            <Dashboard />
        </>
    );
};

export default HomePage;
