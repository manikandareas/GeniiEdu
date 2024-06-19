import GridContainer from '@/common/components/elements/GridContainer';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/components/ui/select';
import { validateRequest } from '@/common/libs/lucia';

import { redirect } from 'next/navigation';
import ClassesTabs from './_components/ClassesTabs';
import ExplorerClasses from './_components/ExplorerClasses';

type ClassesPageProps = {};

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { session } = await validateRequest();

    if (!session) return redirect('/login');

    return (
        <GridContainer>
            <div className='flex auto-rows-max flex-col items-start gap-4 md:gap-8 lg:col-span-3 xl:col-span-3'>
                <div className='grid w-full gap-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-xl font-semibold'>My Class</h1>
                            <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-primary-foreground'>
                                12
                            </span>
                        </div>

                        <Select>
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
                                    <SelectItem value='recently_updated'>
                                        Recently updated
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <ClassesTabs />
                </div>
            </div>

            <ExplorerClasses />
        </GridContainer>
    );
};
export default ClassesPage;
