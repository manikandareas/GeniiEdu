'use client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/components/ui/select';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import StudentClassesTabs from './StudentClassesTabs';

type StudentSectionProps = {};

const StudentSection: React.FC<StudentSectionProps> = () => {
    const { handleChange } = useSearchParamsState();

    return (
        <div className='flex auto-rows-max flex-col items-start gap-4 md:gap-8 lg:col-span-3 xl:col-span-3'>
            <div className='grid w-full gap-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-xl font-semibold'>My Class</h1>
                        <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-primary-foreground'>
                            10
                        </span>
                    </div>

                    <Select onValueChange={(val) => handleChange('sort', val)}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {/* <SelectLabel>Sort by</SelectLabel> */}
                                <SelectItem value='newest_to_oldest'>
                                    Newest to oldest
                                </SelectItem>
                                <SelectItem value='oldest_to_newest'>
                                    Oldest to newest
                                </SelectItem>
                                <SelectItem value='recently_updated' disabled>
                                    Recently updated
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <StudentClassesTabs />
            </div>
        </div>
    );
};
export default StudentSection;
