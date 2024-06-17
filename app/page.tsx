import { Dashboard } from '@/common/components/elements/Dashboard';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';

const HomePage = async () => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
        return redirect('/login');
    }

    if (!user.onBoardingComplete) {
        return redirect('/onboarding');
    }

    return <Dashboard />;
};

export default HomePage;
