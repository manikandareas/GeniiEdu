'use client';

import {
    createClass,
    uploadClassThumbnail,
} from '@/app/_actions/classes-actions';
import { removeFiles } from '@/app/_actions/storage-actions';
import { UploadDropzone } from '@/app/_components/elements/uploadthing';
import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/_components/ui/select';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/app/_components/ui/sheet';
import { Textarea } from '@/app/_components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';
import { generateRandomToken } from '@/app/_utilities';
import { addClassValidation } from '@/app/_validations/classes-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dices, PlusSquare, X } from 'lucide-react';
import Image from 'next/image';
import { ElementRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSession } from '@/app/_providers/session-provider';
import { useAction } from 'next-safe-action/hooks';
import CreateClassSuccessDialog from './create-class-success-dialog';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { revalidatePath } from 'next/cache';
import { userClassesQuery } from '@/app/_hooks/query/user-classes-query';

const CreateClassForm = () => {
    const closeSheetRef = useRef<ElementRef<'button'>>(null);

    const { user: teacher } = useSession();

    const [isCreateClassSuccess, setIsCreateClassSuccess] =
        useState<boolean>(false);

    const { invalidate: invalidateUserClassesQuery } = userClassesQuery();

    const createClassForm = useForm<z.infer<typeof addClassValidation>>({
        resolver: zodResolver(addClassValidation),
        defaultValues: {
            accessType: 'private',
            classCode: '',
            className: '',
            description: '',
            slug: '',
            thumbnail: 'https://picsum.photos/1600/900',
            thumbnailKey: '',
        },
    });

    const { executeAsync: executeCreateClass, status: createClassStatus } =
        useAction(createClass, {
            onSuccess: ({ data }) => {
                toast.success(data?.message);
                setIsCreateClassSuccess(true);
                invalidateUserClassesQuery();
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
            },
        });

    const {
        executeAsync: executeUploadThumbnail,
        status: uploadThumbnailStatus,
    } = useAction(uploadClassThumbnail, {
        onSuccess: ({ data, input }) => {
            createClassForm.setValue('thumbnail', input.url);
            createClassForm.setValue('thumbnailKey', input.key);
            toast.success(data?.message);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
            createClassForm.setValue('thumbnail', '');
            createClassForm.setValue('thumbnailKey', '');
        },
    });

    const onCreateClassClicked = async (
        values: z.infer<typeof addClassValidation>,
    ) => {
        await executeCreateClass(values);
    };

    const onRandomCodeClicked = () => {
        createClassForm.setValue('classCode', generateRandomToken(6));
    };

    const onClearThumbnailClicked = async () => {
        createClassForm.setValue('thumbnail', '');

        if (!createClassForm.getValues('thumbnailKey')) {
            return;
        }
        const res = await removeFiles([
            createClassForm.getValues('thumbnailKey'),
        ] as string[]);

        if (!res.success) {
            toast.error(res.error);
            return;
        }

        return;
    };

    const onUploadThumbnailError = (message: any) => {
        createClassForm.setValue('thumbnail', '');
        createClassForm.setValue('thumbnailKey', '');
        toast.error(message);
    };

    const onCopyClicked = () => {
        navigator.clipboard.writeText(
            messageSuccessCreatedClass({
                code: createClassForm.getValues('classCode'),
                name: createClassForm.getValues('className'),
                teacherName: teacher?.name as string,
            }),
        );

        toast.success('Copied to clipboard');
    };

    const onOkClicked = () => {
        setIsCreateClassSuccess(false);
        closeSheetRef.current?.click();

        createClassForm.reset();
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div>
                    <Button className='hidden sm:block' size={'sm'}>
                        Create Class
                    </Button>
                    <Button
                        className='fixed bottom-4 right-4 sm:hidden'
                        size={'icon'}
                    >
                        <PlusSquare />
                    </Button>
                </div>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-md'>
                <SheetHeader>
                    <SheetTitle>Create Class</SheetTitle>
                </SheetHeader>
                <CreateClassSuccessDialog
                    onCopyClicked={onCopyClicked}
                    onOkClicked={onOkClicked}
                    data={{
                        code: createClassForm.getValues('classCode'),
                        name: createClassForm.getValues('className'),
                    }}
                    isShown={isCreateClassSuccess}
                />
                <Form {...createClassForm}>
                    <form
                        onSubmit={createClassForm.handleSubmit(
                            onCreateClassClicked,
                        )}
                        className='space-y-8 py-4'
                    >
                        <FormField
                            control={createClassForm.control}
                            name='thumbnail'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail</FormLabel>
                                    <FormControl>
                                        {field.value ? (
                                            <div className='relative'>
                                                <Image
                                                    src={field.value}
                                                    alt='Thumbnail'
                                                    width={1600}
                                                    height={900}
                                                    className='h-[246px] w-full max-w-md overflow-hidden rounded-lg object-cover'
                                                />

                                                <button
                                                    type='button'
                                                    disabled={
                                                        (uploadThumbnailStatus ||
                                                            createClassStatus) ===
                                                        'executing'
                                                    }
                                                    onClick={
                                                        onClearThumbnailClicked
                                                    }
                                                    className='absolute right-2 top-2 size-[25px] items-center justify-center rounded-full text-foreground'
                                                >
                                                    <X />
                                                </button>
                                            </div>
                                        ) : (
                                            <UploadDropzone
                                                endpoint='classThumbnailUploader'
                                                onClientUploadComplete={(
                                                    res,
                                                ) => {
                                                    executeUploadThumbnail({
                                                        url: res[0].serverData
                                                            .url,
                                                        key: res[0].key,
                                                    });
                                                }}
                                                onUploadError={(
                                                    error: Error,
                                                ) => {
                                                    // Do something with the error.
                                                    onUploadThumbnailError(
                                                        error.message,
                                                    );
                                                }}
                                            />
                                        )}
                                    </FormControl>
                                    <FormDescription>
                                        Prefer a landscape image.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createClassForm.control}
                            name='className'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Class Name
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Pemrogaman Web'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The name of your class.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createClassForm.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Pemrograman Web is class for web development'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe your class.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createClassForm.control}
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
                                        depends on the class name. hover{' '}
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
                                                        your class, making it
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
                        <FormField
                            control={createClassForm.control}
                            name='accessType'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Visibility</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
                                            <SelectTrigger className='w-[180px]'>
                                                <SelectValue placeholder='Private' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value='private'>
                                                        Private
                                                    </SelectItem>
                                                    <SelectItem value='public'>
                                                        Public
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        By default, your class is private. hover
                                        on{' '}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className='bg-primary/10 italic text-primary underline'>
                                                        private
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className='w-[300px]'>
                                                    <p>
                                                        Choosing to make your
                                                        class <b>Private</b>{' '}
                                                        means that it will not
                                                        be visible to the
                                                        general public in the
                                                        &quot;Explore Public
                                                        Classes&quot; section.
                                                        <br />
                                                        You will still have the
                                                        ability to share the
                                                        class invitation code
                                                        directly with your
                                                        students, allowing them
                                                        to join the class
                                                        privately.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>{' '}
                                        or{' '}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className='bg-primary/10 italic text-primary underline'>
                                                        public
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className='w-[300px]'>
                                                    <p>
                                                        If your class has{' '}
                                                        <b>public visibility</b>
                                                        , its details and the
                                                        invitation code will be
                                                        available to everyone
                                                        exploring public classes
                                                        on GeniiEdu.
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

                        <FormField
                            control={createClassForm.control}
                            name='classCode'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Invitation Code{' '}
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className='relative'>
                                            <Input
                                                placeholder='PWE2024'
                                                {...field}
                                            />

                                            <Button
                                                variant={'ghost'}
                                                size={'icon'}
                                                type='button'
                                                onClick={onRandomCodeClicked}
                                                className='group absolute right-3 top-1/2 -translate-y-1/2 rounded-full text-muted-foreground'
                                            >
                                                <Dices
                                                    size={18}
                                                    className='transition-transform ease-in-out group-hover:rotate-45 group-active:rotate-180'
                                                />
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        This code is used to join your class.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button
                                disabled={createClassStatus === 'executing'}
                                type='submit'
                            >
                                {createClassStatus === 'executing'
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

export default CreateClassForm;

const messageSuccessCreatedClass = (props: {
    name: string;
    code: string;
    teacherName: string;
}) => {
    return `
  Dear Students,

  I am pleased to announce that a new class named "${props.name}" has been successfully created! 🎉

  To join the class, please use the following invitation code:

  *${props.code}*

  Please enter this code on the GeniiEdu platform to access the class materials and updates. If you have any questions or need further assistance, feel free to reach out to me.

  Looking forward to seeing you in the class!

  Best regards,
  ${props.teacherName}
  `;
};
