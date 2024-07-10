import Typography from '@/common/components/ui/typography';

type EmptyStuffProps = {
    children?: React.ReactNode;
    message: string;
};

const EmptyStuff: React.FC<EmptyStuffProps> = ({ message, children }) => {
    return (
        <div className='flex h-56 w-full flex-col items-center justify-center gap-2'>
            <Typography variant={'p'} affects={'small'}>
                {message}
            </Typography>
            {children}
        </div>
    );
};
export default EmptyStuff;
