'use client';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/app/_components/ui/drawer';
import { Button, buttonVariants } from '@/app/_components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/app/_components/ui/card';
import Typography from '@/app/_components/ui/typography';
import { useUpcomingTasksQuery } from '@/app/_hooks/query/upcoimg-tasks-query';
import { formatDate } from '@/app/_utilities';
import { Clock } from 'lucide-react';

type UpcomingTasksProps = {
    classId: string;
};

const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ classId }) => {
    const { data, isLoading } = useUpcomingTasksQuery(classId);
    const isHadData = data && data.length > 0;

    return (
        <Card className='hidden h-fit w-full max-w-xs lg:block'>
            <CardHeader>
                <Typography variant={'h4'}>Upcoming</Typography>
                <CardDescription>
                    {!isHadData
                        ? ' Hooray, no tasks need to be completed immediately!'
                        : `You have ${data.length} tasks to be completed`}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                {isHadData &&
                    data.map((task) => (
                        <UpcomingTaskItem {...task} key={task.id} />
                    ))}
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button size={'sm'} variant={'link'}>
                    View All
                </Button>
            </CardFooter>
        </Card>
    );
};
export default UpcomingTasks;

type UpcomingTaskItemProps = {
    title: string;
    dueDate: Date | null;
};
const UpcomingTaskItem: React.FC<UpcomingTaskItemProps> = ({
    dueDate,
    title,
}) => {
    return (
        <div className='flex items-center gap-2 rounded-md bg-secondary'>
            <div className='h-12 w-12 rounded-md bg-primary' />
            <div className='flex-1 py-1'>
                <p className='text-sm'>{title}</p>
                <p className='text-xs text-muted-foreground'>
                    {formatDate(dueDate ?? new Date())}
                </p>
            </div>
        </div>
    );
};

export const UpcomingTasksDrawer: React.FC<UpcomingTasksProps> = ({
    classId,
}) => {
    const { data, isLoading } = useUpcomingTasksQuery(classId);
    const isHadData = data && data.length > 0;

    return (
        <Drawer>
            <DrawerTrigger
                className={buttonVariants({
                    variant: 'neon',
                    className: 'lg:hidden',
                })}
            >
                <Clock size={16} className='mr-2' />
                Upcoming Tasks
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Upcoming Tasks</DrawerTitle>
                    <DrawerDescription>
                        {!isHadData
                            ? ' Hooray, no tasks need to be completed immediately!'
                            : `You have ${data.length} tasks to be completed`}
                    </DrawerDescription>
                </DrawerHeader>
                <div className='px-4 py-2'>
                    {isHadData &&
                        data.map((task) => (
                            <UpcomingTaskItem {...task} key={task.id} />
                        ))}
                </div>
                <DrawerFooter>
                    <DrawerClose>
                        <Button className='w-full' variant='outline'>
                            Close
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
