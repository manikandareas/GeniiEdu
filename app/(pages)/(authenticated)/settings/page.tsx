import { Separator } from '@/app/_components/ui/separator';
import { ProfileForm } from './_components/profile-form';
import { SetSlot } from '@/app/_providers/slot-provider';
import PageHeader from '@/app/_components/elements/page-header';
const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Settings',
        href: '/settings',
    },
];
const SettingsProfilePage = () => {
    return (
        <>
            <SetSlot name='page-header'>
                <PageHeader urls={urls} title='Settings' />
            </SetSlot>
            <div className='space-y-6'>
                <div>
                    <h3 className='text-lg font-medium'>Profile</h3>
                    <p className='text-sm text-muted-foreground'>
                        This is how others will see you on the site.
                    </p>
                </div>
                <Separator />
                <ProfileForm />
            </div>
        </>
    );
};

export default SettingsProfilePage;
