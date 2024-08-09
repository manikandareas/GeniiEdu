import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import { OnboardingTabs } from './_components/onboarding-tabs';

type OnBoardingPageProps = {};

const OnBoardingPage: React.FC<OnBoardingPageProps> = async () => {
    const { session, user } = await validateRequest();

    if (!session || !user) {
        return redirect('/login');
    }

    if (user.onBoardingComplete) {
        return redirect('/');
    }
    return (
        <main className='flex h-screen items-center justify-center p-2 sm:p-0'>
            <OnboardingTabs />
        </main>
    );
};
export default OnBoardingPage;
