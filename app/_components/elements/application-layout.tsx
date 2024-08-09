'use client';

import useCurrentSession from '@/app/_hooks/current-session';
import { useHeaderStore } from '@/app/_stores/header-store';
import { redirect, usePathname } from 'next/navigation';
import Header from './header';

type ApplicationLayoutProps = {
    children: React.ReactNode;
};

const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    const isHeaderShown = useHeaderStore((state) => state.isShown);

    const session = useCurrentSession();

    if (!session) {
        return redirect('/login');
    }

    switch (pathname) {
        case '/onboarding':
            return <>{children}</>;

        default:
            return (
                <div className='mx-auto flex min-h-screen w-full max-w-7xl flex-col bg-background'>
                    {/* <Sidebar /> */}
                    <div className='flex flex-col sm:gap-2'>
                        {isHeaderShown && <Header />}
                        {children}
                    </div>
                </div>
            );
    }
};
export default ApplicationLayout;
