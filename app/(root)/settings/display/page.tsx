import { Separator } from '@/common/components/ui/separator';
import { DisplayForm } from './_components/display-form';
import HeaderOptions from '@/common/components/elements/header-options';

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Settings',
        href: '/settings',
    },
    {
        name: 'Display',
        href: '/settings/display',
    },
];

export default function SettingsDisplayPage() {
    return (
        <>
            <HeaderOptions title='Settings' urls={urls} />
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Display</h3>
                    <p className='text-sm text-muted-foreground'>
                        Turn items on or off to control what&apos;s displayed in
                        the app.
                    </p>
                </div>
                <Separator />
                <DisplayForm />
            </div>
        </>
    );
}
