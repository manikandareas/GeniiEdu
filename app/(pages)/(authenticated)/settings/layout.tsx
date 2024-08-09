import { Metadata } from 'next';
import { Separator } from '@/app/_components/ui/separator';

import PageHeader from '@/app/_components/elements/page-header';
import { SettingsNav } from './_components/settings-nav';
import { Slot } from '@/app/_providers/slot-provider';

export const metadata: Metadata = {
    title: 'Forms',
    description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/settings',
    },
    {
        title: 'Account',
        href: '/settings/account',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
    {
        title: 'Notifications',
        href: '/settings/notifications',
    },
    {
        title: 'Display',
        href: '/settings/display',
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
            <div className='space-y-6 p-4 sm:px-0 sm:py-0'>
                <Slot name='page-header' />
                <div className='flex flex-col space-y-8 sm:px-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <aside className='-mx-4 lg:w-1/5'>
                        <SettingsNav items={sidebarNavItems} />
                    </aside>
                    <div className='flex-1 lg:max-w-2xl'>{children}</div>
                </div>
            </div>
        </>
    );
}
