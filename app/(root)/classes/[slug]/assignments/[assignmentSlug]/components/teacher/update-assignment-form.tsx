import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/common/components/ui/sheet';
import { EditIcon } from 'lucide-react';

type UpdateAssignmentFormProps = {};

const UpdateAssignmentForm: React.FC<UpdateAssignmentFormProps> = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='default'>
                    <EditIcon className='mr-2' size={20} />
                    Edit Assignment
                </Button>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-xl'>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            value='Pedro Duarte'
                            className='col-span-3'
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='username' className='text-right'>
                            Username
                        </Label>
                        <Input
                            id='username'
                            value='@peduarte'
                            className='col-span-3'
                        />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type='submit'>Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
export default UpdateAssignmentForm;
