import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Typography from '@/common/components/ui/typography';

type UpcomingTasksProps = {};

const UpcomingTasks: React.FC<UpcomingTasksProps> = () => {
    return (
        <Card className='hidden w-full max-w-xs lg:block'>
            <CardHeader>
                <Typography variant={'h4'}>Upcoming</Typography>
                <CardDescription>
                    Hooray, no tasks need to be completed immediately!
                </CardDescription>
            </CardHeader>
            <CardFooter className='flex justify-end'>
                <Button size={'sm'} variant={'link'}>
                    View All
                </Button>
            </CardFooter>
        </Card>
    );
};
export default UpcomingTasks;
