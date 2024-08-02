import { Separator } from '@/common/components/ui/separator';
import { ProfileForm } from './_components/profile-form';
import { SetSlot } from '@/common/components/providers/slot';
import PageHeader from '@/common/components/elements/page-header';
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
