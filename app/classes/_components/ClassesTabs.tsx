'use client';
import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Badge } from '@/common/components/elements/Badge';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { DummyProgress } from '@/common/constants/DummyProgress';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { DefaultProfile } from '@/common/constants/DefaultProfile';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/common/libs/utils';
import { useSession } from '@/common/components/providers/SessionProvider';
import JoinClassForm from './JoinClassForm';
import CreateClassForm from './CreateClassForm';

type ClassesTabsProps = {};

const ClassesTabs: React.FC<ClassesTabsProps> = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const { user } = useSession();

    const handleChange = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('tab', term);
        } else {
            params.delete('tab');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs value={searchParams.get('tab') ?? 'all'} defaultValue='all'>
            <TabsList className='flex justify-between bg-transparent'>
                <div>
                    <TabsTrigger
                        value='all'
                        onClick={() => handleChange('')}
                        className={cn('border-blue-600', {
                            'border-b': !searchParams.get('tab'),
                        })}
                    >
                        <span className='mr-2 flex aspect-square w-5 items-center justify-center rounded-full bg-blue-300/10 text-xs text-blue-500'>
                            14
                        </span>{' '}
                        All
                    </TabsTrigger>
                    <TabsTrigger
                        value='OnGoing'
                        onClick={() => handleChange('ongoing')}
                        className={cn('border-yellow-600', {
                            'border-b': searchParams.get('tab') === 'ongoing',
                        })}
                    >
                        <span className='mr-2 flex aspect-square w-5 items-center justify-center rounded-full bg-yellow-300/10 text-xs text-yellow-500'>
                            10
                        </span>{' '}
                        On Going
                    </TabsTrigger>
                    <TabsTrigger
                        value='Completed'
                        onClick={() => handleChange('completed')}
                        className={cn('border-green-600', {
                            'border-b': searchParams.get('tab') === 'completed',
                        })}
                    >
                        <span className='mr-2 flex aspect-square w-5 items-center justify-center rounded-full bg-green-300/10 text-xs text-green-500'>
                            4
                        </span>{' '}
                        Completed
                    </TabsTrigger>
                </div>
                {user?.role === 'student' ? (
                    <JoinClassForm />
                ) : (
                    <CreateClassForm />
                )}
            </TabsList>
            <TabsContent
                value='all'
                className='grid grid-cols-1 gap-4 lg:grid-cols-4'
            >
                {[...DummyProgress, ...DummyProgress, ...DummyProgress].map(
                    (data) => (
                        <ClassesCard key={nanoid(5)} classData={data} />
                    ),
                )}
            </TabsContent>
        </Tabs>
    );
};
export default ClassesTabs;

type ClassesCardProps = {
    classData: {
        id: number;
        title: string;
        teacher: string;
    };
};
export const ClassesCard: React.FC<ClassesCardProps> = ({ classData }) => {
    return (
        <Card
            x-chunk='dashboard-05-chunk-2'
            className='transition-all ease-linear hover:px-[2px]'
        >
            <CardHeader className='pb-2'>
                {/* <CardDescription> */}
                <Badge
                    variant={classData.id % 2 === 0 ? 'ongoing' : 'completed'}
                >
                    {classData.id % 2 === 0 ? 'On Going' : 'Completed'}
                </Badge>
                {/* </CardDescription> */}

                <CardTitle className='text-2xl'>{classData.title}</CardTitle>
            </CardHeader>
            <CardContent className='flex items-center gap-2'>
                <Image
                    width={40}
                    height={40}
                    src={DefaultProfile.profilePicture}
                    alt={classData.title}
                    className='rounded-full'
                />
                <p>{classData.teacher}</p>
            </CardContent>
            <CardFooter className='flex items-end justify-between'>
                <span className='text-xs text-muted-foreground'>
                    Active 56 minute(s) ago
                </span>

                <Button variant={'outline'} size={'sm'}>
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};
