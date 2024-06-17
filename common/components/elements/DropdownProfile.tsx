'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useSession } from '../providers/SessionProvider';
import Link from 'next/link';
import { signOut } from '@/actions/auth.actions';
import { toast } from 'sonner';

type DropdownProfileProps = {};

const DropdownProfile: React.FC<DropdownProfileProps> = () => {
    const { user } = useSession();

    const onSignOutClick = async () => {
        console.log('logging out');
        try {
            const response = await signOut();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='icon'
                    className='overflow-hidden rounded-full'
                >
                    <Image
                        src={user?.profilePicture ?? ''}
                        width={36}
                        height={36}
                        alt='Avatar'
                        className='overflow-hidden rounded-full'
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={'/settings'}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        type='button'
                        onClick={onSignOutClick}
                        variant={'ghost'}
                        className='w-full justify-start text-start text-sm text-destructive'
                    >
                        Sign Out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default DropdownProfile;
