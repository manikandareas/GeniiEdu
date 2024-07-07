import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import { Plus, SendHorizonal, User2 } from 'lucide-react';
import { Input } from '@/common/components/ui/input';

type SubmissionSectionProps = {};

const SubmissionSection: React.FC<SubmissionSectionProps> = () => {
    return (
        <aside className='mx-auto w-full max-w-sm space-y-4 md:mx-0'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle>Assignment</CardTitle>
                    <CardDescription>Submitted</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-4'>
                        <Button className='flex items-center gap-2 border-primary bg-secondary text-primary hover:bg-secondary/90'>
                            <Plus size={16} />
                            <span>Add or Create</span>
                        </Button>
                        <Button>Turn in</Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className=''>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                        <User2 size={20} />
                        <span>Personal Comments</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex items-center gap-2'>
                    <Input placeholder='Add a comment for your teacher...' />
                    <Button variant={'ghost'} size={'icon'}>
                        <SendHorizonal size={16} />
                    </Button>
                </CardContent>
            </Card>
        </aside>
    );
};
export default SubmissionSection;
