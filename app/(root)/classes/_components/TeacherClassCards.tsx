import { GetTeacherClasses } from '@/actions/users.actions';
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

type TeacherClassCardsProps = {
    data: GetTeacherClasses['data'];
};

const TeacherClassCards: React.FC<TeacherClassCardsProps> = ({ data = [] }) => {
    if (!data) return <div>Loading...</div>;
    if (data.length === 0) return <div>No data</div>;

    return (
        <section className='flex flex-wrap gap-3'>
            {data &&
                data.map((item) => (
                    <TeacherClassCardItem
                        title={item.className}
                        key={item.id}
                        slug={item.slug}
                        updatedAt={item.updatedAt ?? new Date()}
                        description={item.description ?? ''}
                        thumbnail={item.thumbnail?.url ?? ''}
                    />
                ))}
        </section>
    );
};
export default TeacherClassCards;

type TeacherClassCardItemProps = {
    slug: string;
    title: string;
    thumbnail: string;
    updatedAt: Date;
    description: string;
};
export const TeacherClassCardItem: React.FC<TeacherClassCardItemProps> = ({
    slug,
    title,
    thumbnail,
    description,
    updatedAt,
}) => {
    const teacher = useCurrentUser();
    return (
        <Card x-chunk='dashboard-05-chunk-2' className='group/card max-w-sm'>
            <CardHeader className='space-y-3'>
                <div className='relative aspect-video h-36'>
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className='rounded-md object-cover object-center'
                    />
                </div>

                <CardTitle className='transition-transform ease-in-out group-hover/card:translate-x-1'>
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
