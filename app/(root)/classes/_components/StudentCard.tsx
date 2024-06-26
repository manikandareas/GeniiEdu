import { Badge } from '@/common/components/elements/Badge';
import { buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

type StudentCardProps = {
    classData: {
        id: string;
        title: string;
        slug: string;
        statusCompletion: 'ongoing' | 'completed' | 'archived';
        teacher: {
            name: string;
            profilePicture: string;
        };
    };
};
export const StudentCard: React.FC<StudentCardProps> = ({ classData }) => {
    return (
        <Card
            x-chunk='dashboard-05-chunk-2'
            className='transition-all ease-linear hover:translate-x-[2px]'
        >
            <CardHeader className='pb-2'>
                {/* <CardDescription> */}
                <Badge
                    variant={classData.statusCompletion}
                    className='capitalize'
                >
                    {classData.statusCompletion === 'ongoing'
                        ? 'On Going'
                        : classData.statusCompletion}
                </Badge>
                {/* </CardDescription> */}

                <CardTitle className='text-2xl'>{classData.title}</CardTitle>
            </CardHeader>
            <CardContent className='flex items-center gap-2'>
                <Image
                    width={40}
                    height={40}
                    src={classData.teacher.profilePicture}
                    alt={classData.title}
                    className='rounded-full'
                />
                <p>{classData.teacher.name}</p>
            </CardContent>
            <CardFooter className='flex items-end justify-between'>
                <span className='text-xs text-muted-foreground'>
                    Active 56 minute(s) ago
                </span>

                <Link
                    href={`/classes/${classData.slug}`}
                    className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                    })}
                >
                    View Details
                </Link>
            </CardFooter>
        </Card>
    );
};
