'use client';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';

type ContinueWithGithubProps = {
    isLoading: boolean;
    executeFn: () => void;
};

const ContinueWithGithub: React.FC<ContinueWithGithubProps> = ({
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
                <Icons.gitHub className='mr-2 h-4 w-4' />
            )}
            GitHub
        </Button>
    );
};
export default ContinueWithGithub;
