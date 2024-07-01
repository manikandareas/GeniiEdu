import { GetDetailModuleBySlug } from '@/actions/modules.action';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { DUMMY_CLASSES } from '@/common/constants/DummyClasses';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import AddToClassForm from './AddToClassForm';

type ClassesUsedListProps = {
    initialData: GetDetailModuleBySlug;
};

const ClassesUsedList: React.FC<ClassesUsedListProps> = ({ initialData }) => {
    return (
        <div className='hidden w-full xl:block'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>
                        Class(es) Used
                    </CardTitle>
                    <CardDescription>
                        Class(es) that used this module
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2'>
                        <Input type='search' placeholder='Search' />
                        <AddToClassForm
                            moduleName={initialData.data?.moduleName ?? ''}
                            moduleId={initialData.data?.id ?? ''}
                        />
                    </div>
                    {DUMMY_CLASSES.map((itm, idx) => (
                        <div
                            key={idx}
                            className='flex items-center justify-between rounded-md bg-background py-4 text-sm'
                        >
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={itm.thumbnail}
                                    alt={itm.className}
                                    width={50}
                                    height={50}
                                    className='size-[50px] rounded-full object-cover object-center'
                                />
                                <p>{itm.className}</p>
                            </div>

                            <MoreHorizontal />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};
export default ClassesUsedList;
