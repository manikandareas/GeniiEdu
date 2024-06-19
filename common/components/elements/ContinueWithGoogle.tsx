'use client';
import { createGoogleAuthorizationURL } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { toast } from 'sonner';

type ContinueWithGoogleProps = {
    isLoading: boolean;
    executeFn: () => void;
};

const ContinueWithGoogle: React.FC<ContinueWithGoogleProps> = ({
    isLoading = false,
    executeFn,
}) => {
    return (
        <Button
            className='w-full'
            variant='outline'
            type='button'
            onClick={executeFn}
        >
            {isLoading ? (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
                <Icons.google className='mr-2 h-4 w-4' />
            )}
            Google
        </Button>
    );
};
export default ContinueWithGoogle;
