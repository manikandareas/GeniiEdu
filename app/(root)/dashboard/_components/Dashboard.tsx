'use client';
import { ChevronRight, Settings2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Calendar } from '@/common/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Progress } from '@/common/components/ui/progress';
import { WobbleCard } from '@/common/components/ui/wobble-card';
import Image from 'next/image';
import { useSession } from '@/common/components/providers/SessionProvider';
import Link from 'next/link';
import { DummyProgress } from '@/common/constants/DummyProgress';
import { nanoid } from 'nanoid';
import { DummyActivities } from '@/common/constants/DummyActivities';
import { AnimatedTooltip } from '@/common/components/ui/animated-tooltip';
import GridContainer from '@/common/components/elements/GridContainer';
import { DefaultProfile } from '@/common/constants/DefaultProfile';

export function Dashboard() {
    const date = new Date();
    const { user } = useSession();

    return (
        <GridContainer>
            <div className='flex auto-rows-max flex-col items-start gap-4 md:gap-8 lg:col-span-3 xl:col-span-3'>
                <WobbleCard containerClassName=' bg-blue-900 '>
                    <div className='max-w-sm'>
                        <h2 className='max-w-sm text-balance text-left text-base font-semibold tracking-[-0.015em] text-white md:max-w-lg md:text-xl lg:text-3xl'>
                            Hello {user?.name} 👋,
                        </h2>
                        <p className='mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200'>
                            Learn anytime, anywhere. Boost your Skills with
                            flexible, online courses.
                        </p>
                    </div>
                    <Image
                        src='/linear.png'
                        width={500}
                        height={500}
                        alt='linear demo image'
                        className='absolute -bottom-10 -right-10 rounded-2xl object-contain md:-right-[40%] lg:-right-[20%]'
                    />
                </WobbleCard>

                <div className='grid w-full gap-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-xl font-semibold'>
                                My Progress
                            </h1>
                            <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-primary-foreground'>
                                10
                            </span>
                        </div>
                        <Link
                            href='#'
                            className='text-xs text-muted-foreground'
                        >
                            View All
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                        {DummyProgress.map((data) => (
                            <Card
                                key={nanoid(5)}
                                x-chunk='dashboard-05-chunk-2'
                            >
                                <CardHeader className='pb-2'>
                                    <CardDescription>
                                        {data.progress}/{data.maxProgress}
                                    </CardDescription>
                                    <CardTitle className='text-2xl'>
                                        {data.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className=''>
                                    <p className='text-xs text-muted-foreground'>
                                        Teacher : {data.teacher}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Progress
                                        value={
                                            (data.progress / data.maxProgress) *
                                            100
                                        }
                                        aria-label={`${((data.progress / data.maxProgress) * 100).toFixed(2)}% increase`}
                                    />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className='flex w-full flex-col gap-8 lg:flex-row'>
                    <div className='flex-1 gap-4'>
                        <div className='mb-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-xl font-semibold'>
                                    Activities
                                </h1>
                                <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-primary-foreground'>
                                    4
                                </span>
                            </div>

                            <Settings2 className='text-xl text-muted-foreground' />
                        </div>
                        <div className='space-y-2'>
                            {DummyActivities.map((data) => (
                                <div
                                    key={nanoid(5)}
                                    className='flex items-center justify-between border-b p-2'
                                >
                                    <div className='flex items-center gap-4'>
                                        <Image
                                            src={data.profilePicture}
                                            width={48}
                                            height={48}
                                            alt={data.teacher}
                                            className='size-12 rounded-full'
                                        />
                                        <div className='space-y-1'>
                                            <h1 className='text-sm'>
                                                {data.teacher}
                                            </h1>
                                            <p className='max-w-[107px] text-wrap text-xs text-muted-foreground'>
                                                {data.className}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='space-y-2'>
                                        <p className='text-xs text-muted-foreground'>
                                            {data.date}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {data.activity}
                                        </p>
                                    </div>

                                    <Button variant='outline'>
                                        <ChevronRight />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 gap-4'>
                        <div className='mb-4 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-xl font-semibold'>
                                    Classes
                                </h1>
                                <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-primary-foreground'>
                                    5
                                </span>
                            </div>

                            <Settings2 className='text-xl text-muted-foreground' />
                        </div>
                        <div className='space-y-2'>
                            {Array.from({ length: 3 }).map(() => (
                                <div
                                    key={nanoid(5)}
                                    className='flex items-center justify-between border-b p-2'
                                >
                                    <Image
                                        src={DefaultProfile.profilePicture}
                                        width={64}
                                        height={64}
                                        alt={'profile'}
                                        className='size-16 rounded-md'
                                    />

                                    <div className='space-y-3'>
                                        <h1 className='text-xs text-muted-foreground'>
                                            Introduction to Genetics
                                        </h1>
                                        <p className='text-xs text-muted-foreground'>
                                            by Jonathan Westan
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            Section 10A
                                        </p>
                                    </div>

                                    <div className='flex h-full items-start justify-center border'>
                                        <AnimatedTooltip items={people} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className=''>
                <h1 className='mb-4 text-xl font-semibold'>Scheduled</h1>

                <Calendar
                    mode='single'
                    selected={date}
                    // onSelect={setDate}
                    className='flex justify-center rounded-md'
                />
            </div>
        </GridContainer>
    );
}

const people = [
    {
        id: 1,
        name: 'John Doe',
        designation: 'Software Engineer',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
    },
    {
        id: 2,
        name: 'Robert Johnson',
        designation: 'Product Manager',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
        id: 3,
        name: 'Jane Smith',
        designation: 'Data Scientist',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
        id: 4,
        name: 'Emily Davis',
        designation: 'UX Designer',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    },
    {
        id: 5,
        name: 'Tyler Durden',
        designation: 'Soap Developer',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
    },
];
