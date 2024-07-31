import { Separator } from '@/common/components/ui/separator';
import { ProfileForm } from './_components/profile-form';
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
];
const SettingsProfilePage = () => {
    return (
        <>
            <HeaderOptions urls={urls} title='Settings' />
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
