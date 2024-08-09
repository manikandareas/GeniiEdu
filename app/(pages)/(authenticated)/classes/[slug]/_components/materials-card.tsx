import { Button } from '@/app/_components/ui/button';
import Typography from '@/app/_components/ui/typography';
import { DETAILS_CLASS_ICONS } from '@/app/_constants/details-class-tabs';
import { encodeUuid, formatDate } from '@/app/_utilities';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { SiGitbook, SiTask } from 'react-icons/si';

type MaterialsCardProps = {
    createdAt: Date | null;
    // updatedAt: Date | null;
    id: string;
    // classId: string;
    title: string;
    teacherName: string;
    classSlug: string;
    // content: string;
    // authorId: string;
    // publishedAt: Date;
    // files: {
    //     createdAt: Date | null;
    //     updatedAt: Date | null;
    //     id: number;
    //     learningMaterialId: string;
    //     fileId: string;
    // }[];
    type: 'assignment' | 'material';
};

const MaterialsCard: React.FC<MaterialsCardProps> = (props) => {
    const encodedId = encodeUuid(props.id);
    return (
        <Link
            href={`/classes/${props.classSlug}/${props.type === 'material' ? 'materials' : 'assignments'}/${encodedId}`}
            className='flex items-center gap-4 rounded-md border bg-secondary px-4 py-4 md:px-6'
        >
            <span className='inline-flex aspect-square size-10 items-center justify-center rounded-full bg-primary text-white'>
                {props.type === 'assignment' ? (
                    <DETAILS_CLASS_ICONS.assignments.icon size={16} />
                ) : (
                    <DETAILS_CLASS_ICONS.learningMaterials.icon size={16} />
                )}
            </span>

            <div className='flex w-full items-center justify-between'>
                <div>
                    <Typography className='text-pretty leading-tight'>
                        {props.teacherName} memposting tugas baru: {props.title}
                    </Typography>
                    <Typography affects={'muted'} className='text-xs'>
                        {formatDate(props.createdAt ?? new Date())}
                    </Typography>
                </div>

                <Button variant={'ghost'} size={'icon'}>
                    <MoreVertical />
                </Button>
            </div>
        </Link>
    );
};
export default MaterialsCard;
