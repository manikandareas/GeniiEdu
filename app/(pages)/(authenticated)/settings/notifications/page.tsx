import { Separator } from '@/app/_components/ui/separator';
import { NotificationsForm } from './_components/notifications-form';
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
        name: 'Notifications',
        href: '/settings/notifications',
    },
];

export default function SettingsNotificationsPage() {
    return (
        <>
            <SetSlot name='page-header'>
                <PageHeader title='Settings Notifications' urls={urls} />
            </SetSlot>
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Notifications</h3>
                    <p className='text-sm text-muted-foreground'>
                        Configure how you receive notifications.
                    </p>
                </div>
                <Separator />
                <NotificationsForm />
            </div>
        </>
    );
}
