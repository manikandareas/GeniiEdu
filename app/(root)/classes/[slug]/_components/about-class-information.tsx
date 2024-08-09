import { GetDetailsClassResponse } from '@/actions/classes.actions';
import { Badge } from '@/common/components/elements/badge';
import { buttonVariants } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import { cn } from '@/common/libs/utils';
import { Copy, Edit3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SiGmail, SiInstagram, SiWhatsapp } from 'react-icons/si';
import StudentList from './student-list';
import TeacherInformation from './teacher-information';
type AboutClassInformationProps = {
    initialData: GetDetailsClassResponse;
};

const AboutClassInformation: React.FC<AboutClassInformationProps> = ({
    initialData,
}) => {
    if (!initialData.data) {
        return null;
    }
    return (
        <div className='relative h-screen flex-1 overflow-x-hidden pb-14'>
            {/* <div className='top-5 h-screen flex-1 overflow-x-hidden md:sticky md:col-span-2'> */}
            <Link
                href={`/classes/${initialData.data.slug}/editor`}
                className={cn(
                    buttonVariants({
                        className: 'absolute right-4 top-4',
                        variant: 'outline',
                    }),
                )}
            >
                <Edit3 size={16} className='mr-2' /> Edit Class
            </Link>
            {/* Head */}
            <div className='space-y-6'>
                <Image
                    src={initialData.data.thumbnail[0]?.url ?? ''}
                    width={1600}
                    height={900}
                    alt={initialData.data.thumbnail[0]?.key ?? ''}
                    className='h-[300px] overflow-clip rounded-md object-cover object-center'
                />

                <Typography
                    variant={'h1'}
                    className='mt-4 text-3xl font-semibold md:text-4xl'
                >
                    {initialData.data.className}
                </Typography>

                <div className='flex flex-col justify-between gap-2 md:flex-row md:items-center'>
                    <div className='flex items-center gap-4'>
                        {DUMMY_BADGES.map((item, index) => (
                            <BadgeItem key={index} {...item} />
                        ))}
                    </div>
                    <code
                        title='Invitation Code'
                        className='w-fit rounded-sm border p-2 font-mono text-sm tracking-widest hover:cursor-pointer'
                    >
                        <Copy className='mr-2 inline' size={16} />
                        {initialData.data.classCode}
                    </code>
                </div>

                <p className='text-muted-foreground'>
                    {initialData.data.description}
                </p>
            </div>

            {/* Content */}
            <div className='mt-8 space-y-4'>
                <Typography variant={'h4'}>
                    A Class by{' '}
                    <span className='font-bold text-primary'>
                        {initialData.data.teacher.name}
                    </span>
                </Typography>

                <TeacherInformation
                    bio={initialData.data.teacher.bio ?? ''}
                    name={initialData.data.teacher.name ?? ''}
                    profilePicture={
                        initialData.data.teacher.profilePicture ?? ''
                    }
                    username={initialData.data.teacher.username ?? ''}
                />
                <div className='flex items-center justify-between'>
                    <Typography
                        variant={'h4'}
                        className='inline-flex items-center gap-2'
                    >
                        Students{' '}
                        <span className='inline-flex size-6 items-center justify-center rounded-full bg-primary text-xs text-secondary'>
                            28
                        </span>
                    </Typography>

                    <Link
                        href={`/classes/${initialData.data.slug}/students`}
                        className='text-primary'
                    >
                        <Typography
                            className={buttonVariants({
                                variant: 'link',
                                size: 'sm',
                            })}
                        >
                            More
                        </Typography>
                    </Link>
                </div>

                <StudentList />
            </div>
        </div>
    );
};
export default AboutClassInformation;

type BadgeItemProps = {
    count: number;
    title: string;
};
const BadgeItem = (props: BadgeItemProps) => {
    return (
        <div className='flex items-center gap-2'>
            <Badge variant={'completed'}>{props.count}</Badge>
            <p>{props.title}</p>
        </div>
    );
};

const DUMMY_BADGES = [
    {
        title: 'Module',
        count: 54,
    },
    {
        title: 'Lessons',
        count: 194,
    },
    {
        title: 'Exams',
        count: 13,
    },
];
