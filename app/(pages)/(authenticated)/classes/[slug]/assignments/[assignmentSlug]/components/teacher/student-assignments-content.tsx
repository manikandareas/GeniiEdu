'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/_components/ui/select';
import Typography from '@/app/_components/ui/typography';
import { useDetailsAssignmentQuery } from '@/app/_hooks/query/details-assignment-query';
import { columns } from './columns';
import { DataTable } from './data-table';
import HintTable from './hint-table';
import PreviewSubmissions from './preview-submissions';
import ReturnSubmissions from './return-submissions';
import { InferReturnType } from '@/app/_data-access/types';
import assignmentsData from '@/app/_data-access/assignments';
import { GetDetailsAssignmentResponse } from '@/app/_actions/assignments-actions';
import { useQuery } from '@tanstack/react-query';
import { getSubmissionsWhereAssId } from '@/app/_actions/submissions-actions';

type StudentAssignmentsContentProps = {
    initialData: GetDetailsAssignmentResponse;
};

const StudentAssignmentsContent: React.FC<StudentAssignmentsContentProps> = ({
    initialData,
}) => {
    const { data: submissions } = useQuery({
        queryKey: [initialData.id, 'submissions'],
        queryFn: () => getSubmissionsWhereAssId(initialData.id),
    });

    return (
        <main className='space-y-4'>
            {/* Action bar */}
            {/* <div className='flex h-16 items-center justify-between'> */}
            {/* <div className='flex items-center gap-x-4'>
                    <ReturnSubmissions assignmentId={data.id as string} />
                    <Button variant={'ghost'} size={'icon'}>
                        <Mail size={24} />
                    </Button>
                </div> */}

            {/* <div className='flex items-center gap-x-4'>
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
            </div> */}

            <section className='flex'>
                <div className='h-screen w-full space-y-4 lg:max-w-sm'>
                    <div className='flex items-center justify-between'>
                        <ReturnSubmissions
                            assignmentId={initialData.id as string}
                        />
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
                    </div>
                    <DataTable columns={columns} data={submissions ?? []} />
                    <HintTable />
                </div>
                <div className='hidden h-screen w-full lg:block'>
                    <div className='space-y-2 p-4'>
                        <Typography variant={'h4'}>
                            {initialData.title}
                        </Typography>

                        <div className='flex justify-between'>
                            <div className='flex w-32 divide-x'>
                                <div className='p-4'>
                                    <Typography variant={'h2'}>
                                        {submissions?.length}
                                    </Typography>
                                    <p className='text-xs text-muted-foreground'>
                                        Diserahkan
                                    </p>
                                </div>
                                <div className='p-4'>
                                    <Typography variant={'h2'}>
                                        {
                                            submissions?.filter(
                                                (item) => item.isGraded,
                                            ).length
                                        }
                                    </Typography>
                                    <p className='text-xs text-muted-foreground'>
                                        Ditugaskan
                                    </p>
                                </div>
                            </div>

                            <div>
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

                        <PreviewSubmissions submissions={submissions ?? []} />
                    </div>
                </div>
            </section>
        </main>
    );
};
export default StudentAssignmentsContent;
