'use client';
import { Button } from '@/common/components/ui/button';
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

import { FindDetailsAssignmentForTeacherResponse } from '@/common/data-access/assignments';
import { useDetailsAssignmentQuery } from '@/common/hooks/details-assignment-query';
import { columns } from './Columns';
import { DataTable } from './data-table';
import PreviewSubmissions from './preview-submissions';
import ReturnSubmissions from './return-submissions';
import SwitchAssignmentStatus from './switch-assignment-status';
import HintTable from './hint-table';

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
                                <HintTable />
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

                                    <PreviewSubmissions
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
