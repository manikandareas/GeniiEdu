'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useMemo } from 'react';

type ApplicationLayoutProps = {
    children: React.ReactNode;
};

const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({ children }) => {
    const pathname = usePathname();

    const currentPath = useMemo(() => {
        switch (pathname) {
            case '/':
                return {
                    name: 'Dashboard',
                    breadCrumbUrl: [
                        {
                            name: 'Dashboard',
                            href: '/',
                        },
                    ],
                };

            case '/classes':
                return {
                    name: 'Classes',
                    breadCrumbUrl: [
                        {
                            name: 'Dashboard',
                            href: '/',
                        },
                        {
                            name: 'Classes',
                            href: '/classes',
                        },
                    ],
                };
            case '/settings':
                return {
                    name: 'Settings',
                    breadCrumbUrl: [
                        {
                            name: 'Dashboard',
                            href: '/',
                        },
                        {
                            name: 'Settings',
                            href: '/settings',
                        },
                    ],
                };
            default:
                return {
                    name: 'Dashboard',
                    breadCrumbUrl: [
                        {
                            name: 'Dashboard',
                            href: '/',
                        },
                    ],
                };
        }
    }, [pathname]);

    switch (pathname) {
        case '/login':
        case '/register':
        case '/forgot-password':
        case '/verify-email':
        case '/onboarding':
            return <>{children}</>;

        default:
            return (
                <div className='flex min-h-screen w-full flex-col bg-background'>
                    <Sidebar />
                    <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                        {!pathname.includes('settings') && (
                            <Header currentPath={currentPath} />
                        )}
                        {children}
                    </div>
                </div>
            );
    }
};
export default ApplicationLayout;
