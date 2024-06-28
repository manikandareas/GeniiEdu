import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import { DUMMY_CLASSES } from '@/common/constants/DummyClasses';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

type ClassesUsedListProps = {};

const ClassesUsedList: React.FC<ClassesUsedListProps> = () => {
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
                        <Button size={'sm'}>
                            Add Class <ChevronDown size={18} className='ml-2' />
                        </Button>
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
