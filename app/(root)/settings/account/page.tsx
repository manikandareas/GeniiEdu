import { Separator } from '@/common/components/ui/separator';
import { AccountForm } from './_components/account-form';
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
        name: 'Account',
        href: '/settings/account',
    },
];
export default function SettingsAccountPage() {
    return (
        <>
            <HeaderOptions title='Settings' urls={urls} />
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Account</h3>
                    <p className='text-sm text-muted-foreground'>
                        Update your account settings. Set your preferred
                        language and timezone.
                    </p>
                </div>
                <Separator />
                <AccountForm />
            </div>
        </>
    );
}
