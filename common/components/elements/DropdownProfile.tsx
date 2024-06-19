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
import { useAction } from 'next-safe-action/hooks';

type DropdownProfileProps = {};

const DropdownProfile: React.FC<DropdownProfileProps> = () => {
    const { user } = useSession();
    const { execute, status } = useAction(signOut, {
        onSuccess: ({ data }) => {
            if (!data) throw new Error('Something went wrong');

            if (!data.success) {
                toast.error(data.error);
                return;
            }

            toast.success(data.message);
        },
        onError: ({ error }) => {
            console.error(JSON.stringify(error, null, 2));
            // toast.error(error);
        },
    });

    const onSignOutClick = () => {
        execute();
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
                        priority
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
                        disabled={status === 'executing'}
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
