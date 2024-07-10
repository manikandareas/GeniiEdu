import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Typography from '@/common/components/ui/typography';
import { MoreVertical } from 'lucide-react';
import { SiGitbook, SiTask } from 'react-icons/si';

type MaterialsCardProps = {
    // createdAt: Date | null;
    // updatedAt: Date | null;
    // id: string;
    // classId: string;
    // title: string;
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
    return (
        <div className='flex items-center gap-4 rounded-md border bg-muted px-6 py-4'>
            <span className='inline-flex size-10 items-center justify-center rounded-full bg-primary'>
                {props.type === 'assignment' ? (
                    <SiTask size={18} />
                ) : (
                    <SiGitbook size={18} />
                )}
            </span>

            <div className='flex w-full items-center justify-between'>
                <div>
                    <Typography>
                        Rizky S. Puspa Rinda memposting tugas baru: Final Test
                    </Typography>
                    <Typography affects={'muted'} className='text-xs'>
                        1 hari yang lalu
                    </Typography>
                </div>

                <Button variant={'ghost'} size={'icon'}>
                    <MoreVertical />
                </Button>
            </div>
        </div>
    );
};
export default MaterialsCard;
