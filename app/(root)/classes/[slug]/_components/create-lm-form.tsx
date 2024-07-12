'use client';

import { createLearningMaterial } from '@/actions/learning-materials.actions';
import { removeFiles, saveFilesToDB } from '@/actions/storage.actions';
import Tiptap from '@/common/components/elements/tiptap';
import { UploadDropzone } from '@/common/components/elements/uploadthing';
import { Button, buttonVariants } from '@/common/components/ui/button';
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/common/components/ui/tooltip';
import { DETAILS_CLASS_ICONS } from '@/common/constants/details-class-tabs';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { LearningMaterialsModel } from '@/common/models';
import YoutubeLink from '@/public/youtube-link.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotebookText, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ElementRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const CreateLMForm = () => {
    const closeSheetRef = useRef<ElementRef<'button'>>(null);

    const { handleChange, searchParams } = useSearchParamsState();

    const params = useParams();

    const isOpen = searchParams.get('add') === 'learning-material';

    const [youtubeLink, setYoutubeLink] = useState('');

    const [youtubeName, setYoutubeName] = useState('');

    const createLMForm = useForm<
        z.infer<typeof LearningMaterialsModel.insertLearningMaterialsSchema>
    >({
        resolver: zodResolver(
            LearningMaterialsModel.insertLearningMaterialsSchema,
        ),
        defaultValues: {
            content: '',
            files: [],
            title: '',
        },
    });

    // @ts-ignore
    const boundSlugWithFn = createLearningMaterial.bind(null, params.slug);

    const { executeAsync: executeInsertLM, status: statusInsertLM } = useAction(
        boundSlugWithFn,
        {
            onSuccess: ({ data }) => {
                toast.success(data?.message);

                createLMForm.reset();

                closeSheetRef.current?.click();
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
            },
        },
    );

    const onCreateModuleClicked = async (
        values: z.infer<
            typeof LearningMaterialsModel.insertLearningMaterialsSchema
        >,
    ) => {
        await executeInsertLM(values);
    };

    const onOpenChange = (open: boolean) => {
        if (!open) {
            handleChange('add', '');
            return;
        }
        handleChange('add', 'learning-material');
    };

    const onXClicked = async (key: string) => {
        createLMForm.setValue(
            'files',
            createLMForm.getValues('files')?.filter((f) => f.key !== key),
        );
        await removeFiles([key]);
    };

    const { executeAsync: executeSaveFile, status: statusSaveFile } = useAction(
        saveFilesToDB,
        {
            onSuccess: ({ data }) => {
                if (!data) return;
                toast.success(data?.message);
                const prevFiles = createLMForm.getValues('files')!;
                createLMForm.setValue(
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
        },
    );

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

    const isLoading =
        statusInsertLM === 'executing' || statusSaveFile === 'executing';

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button variant={'outline'}>
                    <DETAILS_CLASS_ICONS.learningMaterials.icon
                        className='mr-2'
                        size={16}
                    />
                    Learning Materials
                </Button>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-xl'>
                <SheetHeader>
                    <SheetTitle className='flex items-center gap-2'>
                        <DETAILS_CLASS_ICONS.learningMaterials.icon size={24} />
                        Learning Material
                    </SheetTitle>
                </SheetHeader>

                <Form {...createLMForm}>
                    <form
                        onSubmit={createLMForm.handleSubmit(
                            onCreateModuleClicked,
                        )}
                        className='space-y-8 py-4'
                    >
                        <FormField
                            control={createLMForm.control}
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
                            control={createLMForm.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Tiptap
                                            description={
                                                'Write your content here'
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
                            control={createLMForm.control}
                            name='files'
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
                                                    disabled={isLoading}
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
                                                        disabled={isLoading}
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
                                                                        YoutubeLink
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

                        <SheetFooter>
                            <Button
                                disabled={isLoading}
                                type='button'
                                onClick={() => createLMForm.reset()}
                                variant='ghost'
                            >
                                Reset
                            </Button>
                            <Button type='submit'>Create</Button>
                            <SheetClose asChild>
                                <Button
                                    disabled={isLoading}
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

export default CreateLMForm;

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
