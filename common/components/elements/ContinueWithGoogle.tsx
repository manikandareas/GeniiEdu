'use client';
import { createGoogleAuthorizationURL } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { toast } from 'sonner';

type ContinueWithGoogleProps = {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

const ContinueWithGoogle: React.FC<ContinueWithGoogleProps> = ({
    isLoading,
    setIsLoading,
}) => {
    const onContinueWithGoogleClicked = async () => {
        setIsLoading(true);

        const res = await createGoogleAuthorizationURL();
        if (res.error) {
            toast.error(res.error);
        } else if (res.success) {
            window.location.href = res.data;
        }
        setIsLoading(false);
    };
    return (
        <Button
            className='w-full'
            variant='outline'
            type='button'
            onClick={onContinueWithGoogleClicked}
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
