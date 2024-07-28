'use client';
import { Button, buttonVariants } from '@/common/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/components/ui/select';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { Mail, Settings } from 'lucide-react';
import DetailsAssignment from '../details-assignment';

import Typography from '@/common/components/ui/typography';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/common/components/ui/card';
import { FindDetailsAssignmentForTeacherResponse } from '@/common/data-access/assignments';
import { useDetailsAssignmentQuery } from '@/common/hooks/details-assignment-query';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { prettyText } from '@/common/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import { columns, SubmissionsAssignment } from './Columns';
import { DataTable } from './data-table';
import ReturnSubmissions from './return-submissions';
import SwitchAssignmentStatus from './switch-assignment-status';
import TooltipTable from './tooltip-table';
import PersonalComments from '../student/personal-comments';

type TeacherSectionProps = {
    initialData: FindDetailsAssignmentForTeacherResponse;
};

const TeacherSection: React.FC<TeacherSectionProps> = ({ initialData }) => {
    const { data } = useDetailsAssignmentQuery(initialData, {
        assignmentId: initialData?.id as string,
        userId: initialData?.author.id as string,
    });
    const queryData =
        data as NonNullable<FindDetailsAssignmentForTeacherResponse>;
    return (
        <main className='w-full px-4 py-4 md:px-6 md:py-0'>
            <Tabs defaultValue='studentAssignment' className=''>
                <TabsList className='mb-2'>
                    <TabsTrigger value='details'>Details</TabsTrigger>
                    <TabsTrigger value='studentAssignment'>
                        Student Assignment
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='details'>
                    <DetailsAssignment data={queryData} className='mx-auto' />
                </TabsContent>
                <TabsContent value='studentAssignment'>
                    <main className='space-y-4'>
                        {/* Action bar */}
                        <div className='flex h-16 items-center justify-between'>
                            <div className='flex items-center gap-x-4'>
                                <ReturnSubmissions
                                    assignmentId={queryData.id as string}
                                />
                                <Button variant={'ghost'} size={'icon'}>
                                    <Mail size={24} />
                                </Button>
                            </div>

                            <div className='flex items-center gap-x-4'>
                                <Select defaultValue='100'>
                                    <SelectTrigger className='w-[180px]'>
                                        <SelectValue
                                            defaultValue={'100'}
                                            placeholder='100'
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='100'>100</SelectItem>
                                        <SelectItem value='tidak-dinilai'>
                                            Tidak dinilai
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant={'ghost'} size={'icon'}>
                                    <Settings size={24} />
                                </Button>
                            </div>
                        </div>

                        <section className='flex'>
                            <div className='h-screen w-full lg:max-w-sm'>
                                <DataTable
                                    columns={columns}
                                    data={queryData?.submissions ?? []}
                                />
                                <TooltipTable />
                            </div>
                            <div className='hidden h-screen w-full lg:block'>
                                <div className='space-y-2 p-4'>
                                    <Typography variant={'h4'}>
                                        {queryData.title}
                                    </Typography>

                                    <div className='flex justify-between'>
                                        <div className='flex w-32 divide-x'>
                                            <div className='p-4'>
                                                <Typography variant={'h2'}>
                                                    {
                                                        queryData.submissions
                                                            .length
                                                    }
                                                </Typography>
                                                <p className='text-xs text-muted-foreground'>
                                                    Diserahkan
                                                </p>
                                            </div>
                                            <div className='p-4'>
                                                <Typography variant={'h2'}>
                                                    {
                                                        queryData.submissions.filter(
                                                            (item) =>
                                                                item.isGraded,
                                                        ).length
                                                    }
                                                </Typography>
                                                <p className='text-xs text-muted-foreground'>
                                                    Ditugaskan
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <SwitchAssignmentStatus
                                                assignmentId={
                                                    initialData?.id ?? ''
                                                }
                                                isOpen={
                                                    initialData?.isOpen ?? false
                                                }
                                            />

                                            <div className='pt-2'>
                                                <Select defaultValue='100'>
                                                    <SelectTrigger className='w-[180px] border-transparent'>
                                                        <SelectValue
                                                            defaultValue={'100'}
                                                            placeholder='100'
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='100'>
                                                            Semua
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Diserahkan
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Ditugaskan
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Dinilai
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <OverviewSubmissionCards
                                        submissions={
                                            initialData?.submissions ?? []
                                        }
                                    />
                                </div>
                            </div>
                        </section>
                    </main>
                </TabsContent>
            </Tabs>
        </main>
    );
};
export default TeacherSection;

type OverviewSubmissionCardProps = SubmissionsAssignment;
const OverviewSubmissionCard: React.FC<OverviewSubmissionCardProps> = (
    props,
) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
                <Image
                    width={32}
                    height={32}
                    src={props.student.profilePicture ?? ''}
                    alt={props.student.name ?? ''}
                    className='rounded-full'
                />
                <Typography>{props.student.name}</Typography>
            </CardHeader>
            <CardContent className='space-y-2'>
                <iframe
                    src={props.files[0].url}
                    width={200}
                    height={200}
                    className='aspect-video max-h-24 w-full object-cover'
                    // alt='file name'
                />

                <Typography affects={'muted'}>
                    {prettyText(props.files[0].name)}
                </Typography>
            </CardContent>
            <CardFooter>
                <Typography className='text-sm text-primary'>
                    Diserahkan
                </Typography>
            </CardFooter>
        </Card>
    );
};

const OverviewSubmissionCards = ({
    submissions,
}: {
    submissions: SubmissionsAssignment[];
}) => {
    const { handleChange, searchParams } = useSearchParamsState();
    return (
        <>
            {!!!searchParams.get('sb') ? (
                <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
                    {submissions.map((item) => (
                        <OverviewSubmissionCard key={item.id} {...item} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {submissions
                        .filter((item) => item.id === searchParams.get('sb'))
                        .map((item) => (
                            <DetailsSubmission key={item.id} data={item} />
                        ))}
                </div>
            )}
        </>
    );
};

const DetailsSubmission: React.FC<{ data: SubmissionsAssignment }> = ({
    data,
}) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <Image
                    src={data.student.profilePicture ?? ''}
                    alt={data.student.name ?? ''}
                    width={70}
                    height={70}
                    className='rounded-full'
                />

                <div>
                    <Typography variant={'h4'}>{data.student.name}</Typography>
                    <Typography affects={'muted'}>
                        @{data.student.username}
                    </Typography>
                </div>
            </div>

            <div className='flex gap-2'>
                {data.files.map((file) => (
                    <div title={file.name} className='space-y-2' key={file.key}>
                        <iframe
                            src={file.url}
                            className='aspect-video w-60 rounded-md'
                            allowFullScreen
                        />
                        <div className='flex items-center gap-2'>
                            <p
                                title={file.name}
                                className='text-xs text-muted-foreground'
                            >
                                {prettyText(file.name, 40)}
                            </p>
                            <Link
                                href={file.url}
                                className={buttonVariants({ variant: 'link' })}
                            >
                                Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <PersonalComments
                assignmentId={data.assignmentId}
                studentId={data.studentId}
            />
        </div>
    );
};
