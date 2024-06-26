import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import { Dashboard } from './_components/Dashboard';
import HeaderOptions from '@/common/components/elements/HeaderOptions';

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
            <HeaderOptions title='Dashboard' urls={urls} />
            <Dashboard />
        </>
    );
};

export default HomePage;
