import { Button } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import { cn } from '@/common/libs/utils';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type SelectedFileProps = {
    isStatic: boolean;
    file: {
        key: string;
        name: string;
        url: string;
        type: 'image' | 'video' | 'pdf' | 'youtube';
    };
    onXClicked: (key: string) => void;
};

const SelectedFile: React.FC<SelectedFileProps> = ({
    file,
    isStatic = false,
    onXClicked,
}) => {
    return (
        <div className='relative flex items-center gap-2 overflow-hidden rounded-sm bg-muted'>
            <Button
                type='button'
                onClick={() => onXClicked(file.key)}
                variant={'default'}
                size={'sm'}
                className={cn(
                    'absolute right-1 top-1 z-10 size-8 rounded-full p-0',
                    {
                        hidden: isStatic,
                    },
                )}
            >
                <X size={16} />
            </Button>
            {file.type === 'image' ? (
                <Image
                    src={file.url}
                    width={100}
                    height={50}
                    alt={file.name}
                    className='max-h-16 w-2/3 rounded-sm border object-cover'
                />
            ) : (
                <iframe
                    width={100}
                    height={50}
                    src={file.url}
                    className='max-h-16 w-1/3 overflow-hidden rounded-sm border object-cover'
                    allowFullScreen
                />
            )}
            <div>
                <Link className='hover:underline' href={file.url}>
                    <Typography variant={'p'} affects={'small'}>
                        {file.name}
                    </Typography>
                </Link>
            </div>
        </div>
    );
};
export default SelectedFile;
