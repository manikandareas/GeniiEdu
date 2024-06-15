'use client';
import { createGithubAuthorizationURL } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Icons } from '../ui/icons';

type ContinueWithGithubProps = {
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
};

const ContinueWithGithub: React.FC<ContinueWithGithubProps> = ({
    isLoading,
    setIsLoading,
}) => {
    const onContinueWithGithubClicked = async () => {
        setIsLoading(true);
        console.debug('github sign in clicked');
        const res = await createGithubAuthorizationURL();
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
            onClick={onContinueWithGithubClicked}
        >
            {isLoading ? (
                <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
                <Icons.gitHub className='mr-2 h-4 w-4' />
            )}
            GitHub
        </Button>
    );
};
export default ContinueWithGithub;
