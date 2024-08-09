import { Separator } from '@/app/_components/ui/separator';
import { DisplayForm } from './_components/display-form';
import PageHeader from '@/app/_components/elements/page-header';
import { SetSlot } from '@/app/_providers/slot-provider';

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
            <SetSlot name='page-header'>
                <PageHeader title='Settings Display' urls={urls} />
            </SetSlot>
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
