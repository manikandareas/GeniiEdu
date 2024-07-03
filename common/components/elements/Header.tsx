'use client';

import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import DropdownProfile from './DropdownProfile';
import GenerateBreadcrumb from './GenerateBreadcrumb';
import SidebarOnSM from './SidebarOnSM';
import { useHeaderStore } from '@/common/stores/header-store';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

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

            <HeaderSearch />
            <div className='sm:hidden'>
                <DropdownProfile />
            </div>
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

export const HeaderSearch = () => {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <>
            <div className='relative ml-auto flex-1 md:grow-0'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                    onFocus={() => setIsActive(true)}
                    type='search'
                    placeholder='Search...'
                    className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
                />
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.1,
                        }}
                        className='absolute bottom-0 left-0 right-0 top-0 flex justify-center bg-black/50 backdrop-blur-sm md:py-16'
                    >
                        <motion.input
                            initial={{ opacity: 0, y: -20, scaleX: 0 }}
                            animate={{ opacity: 1, y: [20, 0], scaleX: 1 }}
                            exit={{ opacity: 0, y: -20, scaleX: 0 }}
                            onBlur={() => setIsActive(false)}
                            transition={{
                                duration: 0.3,
                                ease: 'backInOut',
                            }}
                            type='search'
                            placeholder='Search something...'
                            autoFocus
                            className='flex h-10 w-full max-w-xl rounded-full border border-input bg-background px-6 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
