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
import { useSession } from '../providers/session-provider';
import Link from 'next/link';
import { signOut } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/common/components/ui/alert-dialog';

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
        // @ts-ignore
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
            <DropdownMenuContent className='w-56' align='end'>
                <DropdownMenuLabel>@{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={'/settings'}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type='button'
                                variant={'ghost'}
                                className='w-full justify-start text-start text-sm text-destructive'
                            >
                                Sign Out
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you sure you want to sign out?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Your current session will be terminated.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <Button
                                    onClick={onSignOutClick}
                                    disabled={status === 'executing'}
                                    variant={'destructive'}
                                    className='bg-red-600 text-foreground hover:bg-red-600'
                                >
                                    Sign Out
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default DropdownProfile;
