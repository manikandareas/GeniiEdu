import { Separator } from '@/common/components/ui/separator';
import { AppearanceForm } from './_components/appearance-form';
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
        name: 'Appearance',
        href: '/settings/appearance',
    },
];

export default function SettingsAppearancePage() {
    return (
        <>
            <HeaderOptions urls={urls} title='Settings' />
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Appearance</h3>
                    <p className='text-sm text-muted-foreground'>
                        Customize the appearance of the app. Automatically
                        switch between day and night themes.
                    </p>
                </div>
                <Separator />
                <AppearanceForm />
            </div>
        </>
    );
}
