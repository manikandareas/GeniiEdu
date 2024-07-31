import { Separator } from '@/common/components/ui/separator';
import { NotificationsForm } from './_components/notifications-form';
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
        name: 'Notifications',
        href: '/settings/notifications',
    },
];

export default function SettingsNotificationsPage() {
    return (
        <>
            <HeaderOptions title='Settings' urls={urls} />
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
