'use client';
import { createAssignment } from '@/actions/assignments.actions';
import { removeFiles, saveFilesToDB } from '@/actions/storage.actions';
import Tiptap from '@/common/components/elements/tiptap';
import { UploadDropzone } from '@/common/components/elements/uploadthing';
import { Button, buttonVariants } from '@/common/components/ui/button';
import DatePicker from '@/common/components/ui/date-picker';
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
import { Label } from '@/common/components/ui/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/common/components/ui/sheet';
import { Switch } from '@/common/components/ui/switch';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { TimePeriodSelect } from '@/common/components/ui/time-period-select';
import { TimePickerInput } from '@/common/components/ui/time-picker-input';
import { Period } from '@/common/components/ui/time-picker-utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/common/components/ui/tooltip';
import Typography from '@/common/components/ui/typography';
import { DETAILS_CLASS_ICONS } from '@/common/constants/details-class-tabs';
import { detailsClassQuery } from '@/common/hooks/details-class-query';
import { useUpcomingTasksQuery } from '@/common/hooks/upcoimg-tasks-query';
import { AssignmentsModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type CreateAssignmentFormProps = {
    classId: string;
};

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = (props) => {
    const createAssignmentForm = useForm<
        z.infer<typeof AssignmentsModel.createAssignmentSchema>
    >({
        resolver: zodResolver(AssignmentsModel.createAssignmentSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: new Date(),
            files: [],
            publishedAt: new Date(),
        },
    });

    const params = useParams();
    const { invalidate: invalidateUpcomingTasks } = useUpcomingTasksQuery(
        props.classId,
    );

    const minuteRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const periodRef = useRef<HTMLButtonElement>(null);
    const [period, setPeriod] = useState<Period>('PM');
    const [isHaveDueData, setIsHaveDueData] = useState<boolean>(false);

    const [youtubeLink, setYoutubeLink] = useState('');

    const [youtubeName, setYoutubeName] = useState('');

    const { invalidate } = detailsClassQuery(params.slug as string);

    const onXClicked = async (key: string) => {
        createAssignmentForm.setValue(
            'files',
            createAssignmentForm
                .getValues('files')
                ?.filter((f) => f.key !== key),
        );
        await removeFiles([key]);
    };

    const bindActionAssignmentWithSlug = createAssignment.bind(
        null,
        params.slug as string,
    );

    const {
        executeAsync: executeCreateAssignment,
        isExecuting: isCreatingAssignment,
    } = useAction(bindActionAssignmentWithSlug, {
        onSuccess: ({ data }) => {
            if (!data) return;
            toast.success(data.message);
            createAssignmentForm.reset();
            invalidate();
            invalidateUpcomingTasks();
            document.getElementById('closeButton')?.click();
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    const { executeAsync: executeSaveFile, isExecuting: isSaveFileExecuting } =
        useAction(saveFilesToDB, {
            onSuccess: ({ data }) => {
                if (!data) return;
                toast.success(data?.message);
                const prevFiles = createAssignmentForm.getValues('files')!;
                createAssignmentForm.setValue(
                    'files',
                    prevFiles.concat(
                        data.data.map((f) => ({
                            key: f.key!,
                            id: f.id,
                            type: f.type,
                            url: f.url,
                            name: f.name!,
                        })),
                    ),
                );

                setYoutubeLink('');
                setYoutubeName('');
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
                // toast.error(error);
            },
        });

    const onClientUploadSuccess = async (
        data: {
            url: string;
            key: string;
            type: 'image' | 'video' | 'pdf' | 'youtube';
            name: string;
        }[],
    ) => {
        // do save to database file
        await executeSaveFile(data);
    };

    const onAddYoutubeClicked = async () => {
        if (!youtubeName) {
            toast.error('Please input youtube name first');
            return;
        }
        if (!youtubeLink) {
            toast.error('Youtube link cannot be empty');
            return;
        }

        await executeSaveFile([
            {
                key: nanoid(),
                type: 'youtube',
                url: youtubeLink,
                name: youtubeName,
            },
        ]);
    };

    const onCreateAssignmentClicked = async (
        values: z.infer<typeof AssignmentsModel.createAssignmentSchema>,
    ) => {
        await executeCreateAssignment({
            ...values,
            dueDate: isHaveDueData ? values.dueDate : null,
        });
    };

    const isLoading = isCreatingAssignment || isSaveFileExecuting;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    <DETAILS_CLASS_ICONS.assignments.icon
                        className='mr-2'
                        size={16}
                    />
                    Assignment
                </Button>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-xl'>
                <SheetHeader>
                    <SheetTitle className='flex items-center gap-2'>
                        <DETAILS_CLASS_ICONS.assignments.icon size={24} />
                        Assignment
                    </SheetTitle>
                </SheetHeader>

                <Form {...createAssignmentForm}>
                    <form
                        onSubmit={createAssignmentForm.handleSubmit(
                            onCreateAssignmentClicked,
                        )}
                        className='space-y-8 py-4'
                    >
                        <FormField
                            control={createAssignmentForm.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Pemrogaman Web'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The title of your learning material.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createAssignmentForm.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap
                                            description={
                                                'Write your assignment here'
                                            }
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Write your content here.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name='files'
                            control={createAssignmentForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Files</FormLabel>
                                    <FormControl>
                                        <Tabs
                                            defaultValue='document'
                                            className=''
                                        >
                                            <TabsList className='bg-transparent'>
                                                <TabsTrigger value='document'>
                                                    Document
                                                </TabsTrigger>
                                                <TabsTrigger value='youtube'>
                                                    Youtube
                                                </TabsTrigger>
                                            </TabsList>

                                            {field.value && (
                                                <div className='flex gap-2'>
                                                    {field.value.map((file) => (
                                                        <SelectedFiles
                                                            url={file.url}
                                                            name={file.name}
                                                            key={nanoid()}
                                                            onXClicked={() =>
                                                                onXClicked(
                                                                    file.key,
                                                                )
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <TabsContent value='document'>
                                                <UploadDropzone
                                                    endpoint='learningMaterialsFileUploader'
                                                    appearance={{
                                                        button: buttonVariants({
                                                            variant: 'outline',
                                                            className: 'z-20',
                                                        }),
                                                        label: 'text-primary hover:text-primary/80',
                                                    }}
                                                    onClientUploadComplete={async (
                                                        res,
                                                    ) => {
                                                        await onClientUploadSuccess(
                                                            res.map((r) => ({
                                                                key: r.key,
                                                                url: r.url,
                                                                type: 'pdf',
                                                                name: r.name,
                                                            })),
                                                        );
                                                    }}
                                                />
                                                <FormDescription>
                                                    Attach files up to 2 MB in
                                                    size.
                                                </FormDescription>
                                            </TabsContent>
                                            <TabsContent
                                                value='youtube'
                                                className='space-y-4'
                                            >
                                                <div className='flex flex-col gap-2 md:flex-row md:items-center'>
                                                    <Input
                                                        name='youtube-name'
                                                        placeholder='Name'
                                                        onChange={(e) =>
                                                            setYoutubeName(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        name='youtube-link'
                                                        placeholder='Your Youtube Link'
                                                        onChange={(e) =>
                                                            setYoutubeLink(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        variant={'secondary'}
                                                        type='button'
                                                        onClick={
                                                            onAddYoutubeClicked
                                                        }
                                                    >
                                                        Add Youtube
                                                    </Button>
                                                </div>

                                                <FormDescription>
                                                    Add youtube video via link.
                                                    hover{' '}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <span className='bg-primary/10 italic text-primary underline'>
                                                                    here
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className='w-[350px] space-y-2'>
                                                                <Image
                                                                    src={
                                                                        youtubeLink
                                                                    }
                                                                    alt='Youtube'
                                                                />
                                                                <p>
                                                                    Copy the
                                                                    youtube
                                                                    share link
                                                                    like image
                                                                    above .
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>{' '}
                                                    to learn more.
                                                </FormDescription>
                                            </TabsContent>
                                        </Tabs>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createAssignmentForm.control}
                            name='publishedAt'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Publish Date</FormLabel>

                                    <div className='flex flex-wrap items-end gap-2 lg:flex-nowrap'>
                                        <div className='grid gap-1 text-start'>
                                            <Label
                                                htmlFor='hours'
                                                className='text-xs'
                                            >
                                                Date
                                            </Label>
                                            <DatePicker
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='hours'
                                                className='text-xs'
                                            >
                                                Hours
                                            </Label>
                                            <TimePickerInput
                                                picker='12hours'
                                                period={period}
                                                date={field.value}
                                                setDate={field.onChange}
                                                ref={hourRef}
                                                onRightFocus={() =>
                                                    minuteRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='minutes'
                                                className='text-xs'
                                            >
                                                Minutes
                                            </Label>
                                            <TimePickerInput
                                                picker='minutes'
                                                date={field.value}
                                                setDate={field.onChange}
                                                ref={minuteRef}
                                                onLeftFocus={() =>
                                                    hourRef.current?.focus()
                                                }
                                                onRightFocus={() =>
                                                    secondRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='seconds'
                                                className='text-xs'
                                            >
                                                Seconds
                                            </Label>
                                            <TimePickerInput
                                                picker='seconds'
                                                date={field.value}
                                                setDate={field.onChange}
                                                ref={secondRef}
                                                onLeftFocus={() =>
                                                    minuteRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='period'
                                                className='text-xs'
                                            >
                                                Period
                                            </Label>
                                            <TimePeriodSelect
                                                period={period}
                                                setPeriod={setPeriod}
                                                date={field.value}
                                                setDate={field.onChange}
                                                ref={periodRef}
                                                onLeftFocus={() =>
                                                    secondRef.current?.focus()
                                                }
                                            />
                                        </div>
                                    </div>
                                    <FormDescription>
                                        By default, the assignment will be
                                        published immediately.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={createAssignmentForm.control}
                            name='dueDate'
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>
                                            Due date of assignment
                                        </FormLabel>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={isHaveDueData}
                                                onCheckedChange={
                                                    setIsHaveDueData
                                                }
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon size={18} />
                                                    </TooltipTrigger>
                                                    <TooltipContent className='w-[350px] space-y-2'>
                                                        <Typography>
                                                            Switch on if the
                                                            assignment have due
                                                            date
                                                        </Typography>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap items-end gap-2 lg:flex-nowrap'>
                                        <div className='grid gap-1 text-start'>
                                            <Label
                                                htmlFor='hours'
                                                className='text-xs'
                                            >
                                                Date
                                            </Label>
                                            <DatePicker
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                                disabled={!isHaveDueData}
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='hours'
                                                className='text-xs'
                                            >
                                                Hours
                                            </Label>
                                            <TimePickerInput
                                                picker='12hours'
                                                period={period}
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                                ref={hourRef}
                                                disabled={!isHaveDueData}
                                                onRightFocus={() =>
                                                    minuteRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='minutes'
                                                className='text-xs'
                                            >
                                                Minutes
                                            </Label>
                                            <TimePickerInput
                                                picker='minutes'
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                                ref={minuteRef}
                                                disabled={!isHaveDueData}
                                                onLeftFocus={() =>
                                                    hourRef.current?.focus()
                                                }
                                                onRightFocus={() =>
                                                    secondRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='seconds'
                                                className='text-xs'
                                            >
                                                Seconds
                                            </Label>
                                            <TimePickerInput
                                                picker='seconds'
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                                ref={secondRef}
                                                disabled={!isHaveDueData}
                                                onLeftFocus={() =>
                                                    minuteRef.current?.focus()
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-1 text-center'>
                                            <Label
                                                htmlFor='period'
                                                className='text-xs'
                                            >
                                                Period
                                            </Label>
                                            <TimePeriodSelect
                                                period={period}
                                                setPeriod={setPeriod}
                                                date={field.value as Date}
                                                setDate={field.onChange}
                                                ref={periodRef}
                                                disabled={!isHaveDueData}
                                                onLeftFocus={() =>
                                                    secondRef.current?.focus()
                                                }
                                            />
                                        </div>
                                    </div>
                                    <FormDescription>
                                        By default, the assignment will&apos;t
                                        have a due date.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <SheetFooter>
                            <Button
                                type='button'
                                disabled={isLoading}
                                onClick={() => createAssignmentForm.reset()}
                                variant='ghost'
                            >
                                Reset
                            </Button>
                            <Button disabled={isLoading} type='submit'>
                                Create
                            </Button>
                            <SheetClose asChild>
                                <Button
                                    id='closeButton'
                                    disabled={isLoading}
                                    variant='ghost'
                                    className='sr-only'
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
export default CreateAssignmentForm;

type SelectedFilesProps = {
    onXClicked: () => void;
    url: string;
    name: string;
};
const SelectedFiles: React.FC<SelectedFilesProps> = ({
    onXClicked,
    url,
    name,
}) => {
    return (
        <div className='relative h-24 w-44 overflow-hidden rounded bg-muted'>
            <Button
                type='button'
                onClick={onXClicked}
                variant={'secondary'}
                size={'sm'}
                className='absolute right-1 top-1 z-10 size-8 rounded-full p-0'
            >
                <X size={16} />
            </Button>
            <div className='relative h-16 w-full'>
                <iframe src={url} className='h-full w-full' />
            </div>
            <div className='p-2'>
                <p className='my-auto text-xs'>
                    {name.length > 10 ? `${name.slice(0, 10)}...` : name}
                </p>
            </div>
        </div>
    );
};
