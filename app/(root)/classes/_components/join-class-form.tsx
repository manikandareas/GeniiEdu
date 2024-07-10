import { joinClass } from '@/actions/classes.actions';
import { Button } from '@/common/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/components/ui/dialog';
import { Input } from '@/common/components/ui/input';
import { ClassesModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import React, { ElementRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/ui/form';
import { useQueryClient } from '@tanstack/react-query';
import { PlusSquare } from 'lucide-react';

type JoinClassFormProps = {};

const JoinClassForm: React.FC<JoinClassFormProps> = () => {
    const joinClassForm = useForm<z.infer<typeof ClassesModel.joinClassSchema>>(
        {
            resolver: zodResolver(ClassesModel.joinClassSchema),
            defaultValues: {
                classCode: '',
            },
        },
    );

    const queryClient = useQueryClient();

    const refJoinDialog = React.useRef<ElementRef<'button'>>(null);

    const { executeAsync, status: joinClassStatus } = useAction(joinClass, {
        onSuccess({ data }) {
            toast.success(data?.message);
            joinClassForm.reset();
            queryClient.invalidateQueries({
                queryKey: ['classes'],
            });
            refJoinDialog.current?.click();
        },
        onError({ error }) {
            toast.error(error.serverError);
        },
    });

    const onJoinClassClicked = async (
        values: z.infer<typeof ClassesModel.joinClassSchema>,
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
