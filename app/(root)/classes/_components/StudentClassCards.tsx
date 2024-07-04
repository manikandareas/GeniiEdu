import { GetStudentClasses, GetTeacherClasses } from '@/actions/users.actions';
import { Badge } from '@/common/components/elements/Badge';
import { buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Typography from '@/common/components/ui/typography';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import Image from 'next/image';
import Link from 'next/link';

type StudentClassCardsProps = {
    data: GetStudentClasses['data'];
};

const StudentClassCards: React.FC<StudentClassCardsProps> = ({ data }) => {
    if (!data || !data.classes) return <div>Loading...</div>;

    return (
        <section className='flex flex-wrap gap-3'>
            {data.classes.map((item) => (
                <StudentClassCardItem
                    title={item.class.className}
                    key={item.classId}
                    slug={item.class.slug}
                    updatedAt={item.class.updatedAt ?? new Date()}
                    description={item.class.description ?? ''}
                    thumbnail={item.class.thumbnail?.url ?? ''}
                    statusCompletion={item.statusCompletion}
                />
            ))}
        </section>
    );
};
export default StudentClassCards;

type StudentClassCardItemProps = {
    slug: string;
    title: string;
    thumbnail: string;
    updatedAt: Date;
    description: string;
    statusCompletion: 'ongoing' | 'completed' | 'archived';
};
export const StudentClassCardItem: React.FC<StudentClassCardItemProps> = ({
    slug,
    title,
    thumbnail,
    description,
    updatedAt,
    statusCompletion,
}) => {
    const teacher = useCurrentUser();
    return (
        <Card
            x-chunk='dashboard-05-chunk-2'
            className='group/card w-full max-w-sm'
        >
            <CardHeader className='space-y-3'>
                <Badge className='capitalize' variant={statusCompletion}>
                    {statusCompletion}
                </Badge>
                <div className='relative aspect-video h-36'>
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className='rounded-md object-cover object-center'
                    />
                </div>

                <CardTitle className='transition-transform ease-in-out group-hover/card:translate-x-1'>
                    {/* <Typography variant={'h3'}>{title}</Typography> */}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className='transition-transform ease-in-out group-hover/card:translate-x-1'>
                <Typography className='max-w-xs'>
                    {description.length > 85
                        ? `${description.slice(0, 85)}...`
                        : description}
                </Typography>
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <span className='text-xs text-muted-foreground'>
                    Active 56 minute(s) ago
                </span>

                <Link
                    href={`/classes/${slug}`}
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
