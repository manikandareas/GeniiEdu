'use client';

import { useHeaderStore } from '@/common/stores/header-store';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import DropdownProfile from './dropdown-profile';
import GenerateBreadcrumb from './generate-breadcrumb';
import GlobalSearch from './global-search';
import SidebarOnSM from './sidebar-on-sm';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const { title, urls } = useHeaderStore((state) => ({
        title: state.title,
        urls: state.breadcrumbs,
    }));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <HeaderSkeleton />;
    }

    return (
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <SidebarOnSM />

            <div className='hidden space-y-2 md:block'>
                <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
                <GenerateBreadcrumb urls={urls} />
            </div>

            <GlobalSearch />
            {/* <div className='sm:hidden'> */}
            <DropdownProfile />
            {/* </div> */}
        </header>
    );
};
export default Header;

export const HeaderSkeleton = () => (
    <div className='flex w-full items-center justify-between px-4 sm:px-6'>
        <div className='space-y-1.5'>
            <Skeleton className='h-6 w-40' />
            <Skeleton className='h-6 w-80' />
        </div>

        <Skeleton className='h-10 w-64' />
    </div>
);
