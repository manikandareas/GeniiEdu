'use client';

import { createModule } from '@/actions/modules.action';
import { Button } from '@/common/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/common/components/ui/sheet';
import { Textarea } from '@/common/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/common/components/ui/tooltip';
import { ModulesModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { ElementRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CreateModuleSuccessDialog from './CreateModuleSuccessDialog';

const CreateModuleForm = () => {
    const closeSheetRef = useRef<ElementRef<'button'>>(null);

    const createModuleForm = useForm<
        z.infer<typeof ModulesModel.createModuleSchema>
    >({
        resolver: zodResolver(ModulesModel.createModuleSchema),
        defaultValues: {
            moduleName: '',
            description: '',
            slug: '',
        },
    });

    const [isCreateModuleSuccess, setIsCreateModuleSuccess] = useState<
        boolean | null
    >(false);

    const { status: createModuleStatus, executeAsync } = useAction(
        createModule,
        {
            onSuccess: ({ data }) => {
                if (!data) throw new Error('Something went wrong');
                if (!data.success) {
                    toast.error(data.error);
                    console.error(JSON.stringify(data.error, null, 2));
                    return;
                }

                setIsCreateModuleSuccess(true);
                createModuleForm.setValue('slug', data.data.slug);

                toast.success(data.message);
            },
            onError: (error) => {
                console.error(JSON.stringify(error, null, 2));
            },
        },
    );

    const onCreateModuleClicked = async (
        values: z.infer<typeof ModulesModel.createModuleSchema>,
    ) => {
        console.log('Executing create module');

        await executeAsync(values);
    };

    const onContinueClicked = () => {
        setIsCreateModuleSuccess(false);
    };

    const onCloseClicked = () => {
        setIsCreateModuleSuccess(null);

        closeSheetRef.current?.click();
        createModuleForm.reset();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='space-x-1.5'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                        Add Modules
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-md'>
                <SheetHeader>
                    <SheetTitle>Create Module</SheetTitle>
                </SheetHeader>
                <CreateModuleSuccessDialog
                    data={{
                        name: createModuleForm.getValues('moduleName'),
                        slug: createModuleForm.getValues('slug')!,
                    }}
                    isShown={isCreateModuleSuccess ?? false}
                    onContinueClicked={onContinueClicked}
                    onCloseClicked={onCloseClicked}
                />
                <Form {...createModuleForm}>
                    <form
                        onSubmit={createModuleForm.handleSubmit(
                            onCreateModuleClicked,
                        )}
                        className='space-y-8 py-4'
                    >
                        <FormField
                            control={createModuleForm.control}
                            name='moduleName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Module Name
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Pemrogaman Web'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The name of your module.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createModuleForm.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Pemrograman Web is module for web development'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe your module.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createModuleForm.control}
                            name='slug'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='pemrograman-web-2024'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        If not provided, will be auto-generated
                                        depends on the module name. hover{' '}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className='bg-primary/10 italic text-primary underline'>
                                                        here
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className='w-[300px]'>
                                                    <p>
                                                        The slug is used to
                                                        generate the URL for
                                                        your module, making it
                                                        easy to share and
                                                        remember.
                                                        <br />
                                                        For instance:{' '}
                                                        <code>
                                                            pemrograman_web_2024
                                                        </code>
                                                        .
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>{' '}
                                        to learn more.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <SheetFooter>
                            <Button
                                disabled={createModuleStatus === 'executing'}
                                type='button'
                                onClick={() => createModuleForm.reset()}
                                variant='ghost'
                            >
                                Reset
                            </Button>
                            <Button
                                disabled={createModuleStatus === 'executing'}
                                type='submit'
                            >
                                {createModuleStatus === 'executing'
                                    ? 'Creating...'
                                    : 'Create'}
                            </Button>
                            <SheetClose asChild>
                                <Button
                                    variant='ghost'
                                    className='sr-only'
                                    ref={closeSheetRef}
                                >
                                    Cancel
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default CreateModuleForm;
