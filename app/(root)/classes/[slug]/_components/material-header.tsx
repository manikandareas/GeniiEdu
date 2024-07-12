import { Button } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import { formatDate } from '@/common/libs/utils';
import { LucideBookOpenText, MoreVertical, StickyNoteIcon } from 'lucide-react';

type MaterialHeaderProps = {
    authorName: string;
    createdAt: Date | null;
    icon: 'material' | 'assignment';
    title: string;
};

const MaterialHeader: React.FC<MaterialHeaderProps> = ({
    authorName,
    createdAt,
    icon,
    title,
}) => {
    const formattedDate = formatDate(createdAt ?? new Date());
    return (
        <div className='flex items-center justify-between border-b px-4 py-4 md:px-0'>
            <div className='flex gap-4'>
                <div className='flex size-10 items-center justify-center rounded-full bg-primary text-white'>
                    {icon === 'assignment' ? (
                        <StickyNoteIcon size={24} />
                    ) : (
                        <LucideBookOpenText size={24} />
                    )}
                </div>

                <div>
                    <Typography
                        className='font-medium text-primary'
                        variant={'h3'}
                    >
                        {title}
                    </Typography>
                    <Typography variant={'p'} affects={'muted'}>
                        {authorName} • {formattedDate}
                    </Typography>
                </div>
            </div>

            <Button size={'icon'} variant={'ghost'}>
                <MoreVertical size={16} />
            </Button>
        </div>
    );
};
export default MaterialHeader;
