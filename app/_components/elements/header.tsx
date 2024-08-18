'use client';

import useCurrentUser from '@/app/_hooks/current-user';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavLinks from '../ui/nav-links';
import { Skeleton } from '../ui/skeleton';
import DropdownProfile from './dropdown-profile';
import GlobalSearch from './global-search';
import SidebarOnSM from './sidebar-on-sm';
import TeamSwitcher from './team-switcher';
import Notification from './notification';
import { useUserNotificationsQuery } from '@/app/_hooks/query/user-notifications-query';
import { Goreal } from '@/app/_libs/goreal';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const user = useCurrentUser();
    const pathname = usePathname();
    const { data, isLoading, invalidate } = useUserNotificationsQuery();
    const goreal = new Goreal(user?.id ?? '');

    console.log({ data });

    // Stream notifications
    useEffect(() => {
        goreal.streamNotifications((data) => {
            console.log({ data });
            if (data.includes(Goreal.broadcastKey.NOTIFICATION_UPDATED)) {
                invalidate();
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <HeaderSkeleton />;
    }

    return (
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-4 py-4 sm:static sm:h-auto sm:bg-transparent sm:px-6'>
            <SidebarOnSM />

            <nav className='hidden items-center gap-6 lg:flex'>
                {/* <AppLogo /> */}
                <TeamSwitcher />

                <NavLinks role={user?.role ?? 'student'} pathname={pathname} />
            </nav>
            <GlobalSearch />
            {/* <div className='sm:hidden'> */}
            {!isLoading && (
                <Notification
                    invalidate={invalidate}
                    notifications={data ?? []}
                />
            )}
            <DropdownProfile />
            {/* </div> */}
        </header>
    );
};
export default Header;

export const HeaderSkeleton = () => (
    <div className='flex w-full items-center justify-between px-4 py-4 sm:px-6'>
        <div className='space-y-1.5'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-6 w-80' />
        </div>

        <Skeleton className='h-10 w-64' />
    </div>
);
