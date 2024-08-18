'use client';
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
} from '@/app/_components/ui/alert-dialog';
import { Button } from '../ui/button';
import { signOut } from '@/app/_actions/auth-actions';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { getQueryClient } from '@/app/_providers/react-query-provider';

type SignOutDialogProps = {};

const SignOutDialog: React.FC<SignOutDialogProps> = () => {
    const { execute, status } = useAction(signOut, {
        onSuccess: ({ data }) => {
            toast.success(data?.message);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    const queryClient = getQueryClient();

    const onSignOutClick = () => {
        // @ts-ignore
        queryClient.clear();
        execute();
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger className='relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
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
                    >
                        Sign Out
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default SignOutDialog;
