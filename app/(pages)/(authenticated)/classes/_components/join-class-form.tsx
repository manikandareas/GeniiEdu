import { joinClass } from '@/app/_actions/classes-actions';
import { Button } from '@/app/_components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/_components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import LoadingSpinner from '@/app/_components/ui/loading-spinner';
import { userClassesQuery } from '@/app/_hooks/query/user-classes-query';
import { joinClassValidation } from '@/app/_validations/classes-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusSquare } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import React, { ElementRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type JoinClassFormProps = {};

const JoinClassForm: React.FC<JoinClassFormProps> = () => {
    const joinClassForm = useForm<z.infer<typeof joinClassValidation>>({
        resolver: zodResolver(joinClassValidation),
        defaultValues: {
            classCode: '',
        },
    });

    const { invalidate: invalidateUserClassesQuery } = userClassesQuery();

    const refJoinDialog = React.useRef<ElementRef<'button'>>(null);

    const { executeAsync, status: joinClassStatus } = useAction(joinClass, {
        onSuccess({ data }) {
            toast.success(data?.message);
            joinClassForm.reset();
            invalidateUserClassesQuery();
            refJoinDialog.current?.click();
        },
        onError({ error }) {
            toast.error(error.serverError);
        },
    });

    const onJoinClassClicked = async (
        values: z.infer<typeof joinClassValidation>,
    ) => {
        await executeAsync(values);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div>
                    <Button className='hidden sm:block' size={'sm'}>
                        Join Class
                    </Button>
                    <Button
                        className='fixed bottom-4 right-4 sm:hidden'
                        size={'icon'}
                    >
                        <PlusSquare />
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Join Class</DialogTitle>
                    <DialogDescription>
                        Enter invitation code to join class.
                    </DialogDescription>
                </DialogHeader>
                <Form {...joinClassForm}>
                    <form
                        onSubmit={joinClassForm.handleSubmit(
                            onJoinClassClicked,
                        )}
                        className='space-y-8'
                    >
                        <FormField
                            control={joinClassForm.control}
                            name='classCode'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Invitation Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Class invitation code'
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                disabled={joinClassStatus === 'executing'}
                                type='submit'
                                className=''
                            >
                                {joinClassStatus === 'executing'
                                    ? 'Joining...'
                                    : 'Join'}
                            </Button>
                            <DialogClose asChild>
                                <Button ref={refJoinDialog} className='sr-only'>
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
export default JoinClassForm;
