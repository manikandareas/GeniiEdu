import { Separator } from '@/common/components/ui/separator';
import { AppearanceForm } from './_components/appearance-form';
import PageHeader from '@/common/components/elements/page-header';
import { SetSlot } from '@/common/components/providers/slot';

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
            <SetSlot name='page-header'>
                <PageHeader urls={urls} title='Settings Appearance' />
            </SetSlot>
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
