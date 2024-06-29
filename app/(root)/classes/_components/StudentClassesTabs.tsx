'use client';
import { getStudentClasses } from '@/actions/users.actions';
import { useSession } from '@/common/components/providers/SessionProvider';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { cn } from '@/common/libs/utils';
import { useQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import CreateClassForm from './CreateClassForm';
import JoinClassForm from './JoinClassForm';
import { StudentCard } from './StudentCard';
import { useEffect, useState } from 'react';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';

type StudentClassesTabsProps = {};

const StudentClassesTabs: React.FC<StudentClassesTabsProps> = () => {
    const searchParams = useSearchParams();

    const { user } = useSession();

    const { data } = useQuery({
        queryFn: getStudentClasses,
        queryKey: ['classes'],
    });

    const params = searchParams.get('sort');

    const [sortedData, setSortedData] = useState(data?.data?.classes);

    useEffect(() => {
        switch (searchParams.get('sort')) {
            case 'newest_to_oldest':
                setSortedData(
                    data?.data?.classes?.sort(
                        (a, b) =>
                            new Date(b.joinedAt).getTime() -
                            new Date(a.joinedAt).getTime(),
                    ),
                );
                break;
            default:
                setSortedData([]);
                break;
        }
    }, [params, searchParams, data?.data?.classes]);

    if (!data?.success) return null;

    return (
        <Tabs value={searchParams.get('tab') ?? 'all'} defaultValue='all'>
            <TabsList className='flex justify-between bg-transparent'>
                <div>
                    <StudentTabsTrigger
                        keyType='all'
                        value={
                            typeof data.data === 'string'
                                ? 0
                                : data.data.metadata.all
                        }
                    />

                    <StudentTabsTrigger
                        keyType='ongoing'
                        disabled={typeof data.data === 'string'}
                        value={
                            typeof data.data === 'string'
                                ? 0
                                : data.data.metadata.ongoing
                        }
                    />
                    <StudentTabsTrigger
                        keyType='completed'
                        disabled={typeof data.data === 'string'}
                        value={
                            typeof data.data === 'string'
                                ? 0
                                : data.data.metadata.completed
                        }
                    />
                    <StudentTabsTrigger
                        keyType='archived'
                        disabled={typeof data.data === 'string'}
                        value={
                            typeof data.data === 'string'
                                ? 0
                                : data.data.metadata.archived
                        }
                    />
                </div>
                {user?.role === 'student' ? (
                    <JoinClassForm />
                ) : (
                    <CreateClassForm />
                )}
            </TabsList>
            {data.message || data.data.classes.length === 0 ? (
                <TabsContent
                    className='flex items-center justify-center py-10'
                    value='all'
                >
                    <p className='text-muted-foreground'>{data.message}</p>
                </TabsContent>
            ) : (
                <>
                    <TabsContent
                        value='all'
                        className='grid grid-cols-1 gap-4 lg:grid-cols-4'
                    >
                        {(sortedData!.length > 0
                            ? sortedData
                            : data?.data?.classes
                        )?.map((classData) => (
                            <StudentCard
                                key={nanoid(5)}
                                classData={{
                                    id: classData.class.id,
                                    title: classData.class.className,
                                    slug: classData.class.slug,
                                    statusCompletion:
                                        classData.statusCompletion!,
                                    teacher: {
                                        name:
                                            classData.class.teacher.name || '',
                                        profilePicture:
                                            classData.class.teacher
                                                .profilePicture || '',
                                    },
                                }}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent
                        value='ongoing'
                        className='grid grid-cols-1 gap-4 lg:grid-cols-4'
                    >
                        {data?.data.classes.map((classData) => {
                            if (classData.statusCompletion === 'ongoing')
                                return (
                                    <StudentCard
                                        key={nanoid(5)}
                                        classData={{
                                            id: classData.class.id,
                                            title: classData.class.className,
                                            slug: classData.class.slug,
                                            statusCompletion:
                                                classData.statusCompletion,
                                            teacher: {
                                                name:
                                                    classData.class.teacher
                                                        .name || '',
                                                profilePicture:
                                                    classData.class.teacher
                                                        .profilePicture || '',
                                            },
                                        }}
                                    />
                                );
                        })}
                    </TabsContent>
                    <TabsContent
                        value='archived'
                        className='grid grid-cols-1 gap-4 lg:grid-cols-4'
                    >
                        {data?.data.classes.map((classData) => {
                            if (classData.statusCompletion === 'archived')
                                return (
                                    <StudentCard
                                        key={nanoid(5)}
                                        classData={{
                                            id: classData.class.id,
                                            title: classData.class.className,
                                            slug: classData.class.slug,
                                            statusCompletion:
                                                classData.statusCompletion,
                                            teacher: {
                                                name:
                                                    classData.class.teacher
                                                        .name || '',
                                                profilePicture:
                                                    classData.class.teacher
                                                        .profilePicture || '',
                                            },
                                        }}
                                    />
                                );
                        })}
                    </TabsContent>
                    <TabsContent
                        value='completed'
                        className='grid grid-cols-1 gap-4 lg:grid-cols-4'
                    >
                        {data?.data.classes.map((classData) => {
                            if (classData.statusCompletion === 'completed')
                                return (
                                    <StudentCard
                                        key={nanoid(5)}
                                        classData={{
                                            id: classData.class.id,
                                            title: classData.class.className,
                                            slug: classData.class.slug,
                                            statusCompletion:
                                                classData.statusCompletion,
                                            teacher: {
                                                name:
                                                    classData.class.teacher
                                                        .name || '',
                                                profilePicture:
                                                    classData.class.teacher
                                                        .profilePicture || '',
                                            },
                                        }}
                                    />
                                );
                        })}
                    </TabsContent>
                </>
            )}
        </Tabs>
    );
};
export default StudentClassesTabs;

type StudentTabsTriggerProps = {
    keyType: 'all' | 'ongoing' | 'completed' | 'archived';
    value: number;
    disabled?: boolean;
};

const StudentTabsTrigger: React.FC<StudentTabsTriggerProps> = ({
    disabled = false,
    ...props
}) => {
    const searchParams = useSearchParams();
    const { handleChange } = useSearchParamsState();
    const key = props.keyType === 'all' ? '' : props.keyType;

    const active = searchParams.get('tab');

    return (
        <TabsTrigger
            value='all'
            disabled={disabled}
            onClick={() => handleChange('tab', key)}
            className={cn('capitalize', {
                'border-blue-600': props.keyType === 'all',
                'border-yellow-600': props.keyType === 'ongoing',
                'border-green-600': props.keyType === 'completed',
                'border-stone-600': props.keyType === 'archived',
                'border-b':
                    props.keyType === 'all' && !active
                        ? true
                        : props.keyType === 'ongoing' && active === 'ongoing'
                          ? true
                          : props.keyType === 'completed' &&
                              active === 'completed'
                            ? true
                            : props.keyType === 'archived' &&
                                active === 'archived'
                              ? true
                              : false,
            })}
        >
            <span
                className={cn(
                    'mr-2 flex aspect-square w-5 items-center justify-center rounded-full text-xs',
                    { 'bg-blue-300/10 text-blue-500': props.keyType === 'all' },
                    {
                        'bg-yellow-300/10 text-yellow-500':
                            props.keyType === 'ongoing',
                    },
                    {
                        'bg-green-300/10 text-green-500':
                            props.keyType === 'completed',
                    },
                    {
                        'bg-stone-300/10 text-stone-500':
                            props.keyType === 'archived',
                    },
                )}
            >
                {props.value}
            </span>{' '}
            {props.keyType === 'ongoing' ? 'On Going' : props.keyType}
        </TabsTrigger>
    );
};
