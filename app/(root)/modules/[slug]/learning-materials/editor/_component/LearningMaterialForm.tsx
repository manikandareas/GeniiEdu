'use client';
import Tiptap from '@/common/components/elements/Tiptap';
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
import { LearningMaterialsModel } from '@/common/models';
import { X } from 'lucide-react';
import * as z from 'zod';
import { useLearningMaterialContext } from '../context/learningMaterialContext';
import AttachFiles from './AttachFiles';
import { removeFiles } from '@/actions/storage.actions';
import { useAction } from 'next-safe-action/hooks';
import { createLearningMaterial } from '@/actions/learning-materials.actions';
import { toast } from 'sonner';

type LearningMaterialFormProps = {
    moduleSlug: string;
};

const LearningMaterialForm: React.FC<LearningMaterialFormProps> = ({
    moduleSlug,
}) => {
    const { form } = useLearningMaterialContext();
    // @ts-ignore
    const boundSlugWithFn = createLearningMaterial.bind(null, moduleSlug);

    const { executeAsync, status } = useAction(boundSlugWithFn, {
        onSuccess: ({ data }) => {
            if (!data) throw new Error('Something went wrong');

            if (!data.success) {
                toast.error(data.error);
                return;
            }

            toast.success(data.message);

            form.reset();
        },
    });

    const onSubmitClicked = async (
        values: z.infer<
            typeof LearningMaterialsModel.insertLearningMaterialsSchema
        >,
    ) => {
        await executeAsync(values);
    };

    const onDeleteFileClicked = async (key: string) => {
        form.setValue(
            'files',
            form.getValues('files')?.filter((f) => f.key !== key),
        );
        await removeFiles([key]);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitClicked)}
                className='w-full space-y-8'
            >
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem className=''>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Intro to Web Development'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Title of your learning materials.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='content'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Tiptap
                                    description={'Write your content here'}
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
                    control={form.control}
                    name='files'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Files</FormLabel>
                            <FormControl>
                                <>
                                    {field.value &&
                                        field.value.map((file) => {
                                            return (
                                                <div
                                                    key={file.key}
                                                    className='relative flex w-fit rounded-lg border border-muted'
                                                >
                                                    <iframe
                                                        width={150}
                                                        height={75}
                                                        className='overflow-hidden rounded-bl-lg rounded-tl-lg object-cover'
                                                        src={file.url}
                                                    />
                                                    <div className='flex flex-col items-start justify-center p-2 text-muted-foreground'>
                                                        <p className='text-sm uppercase'>
                                                            {file.key}
                                                        </p>
                                                        <p className='text-xs'>
                                                            {file.type}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type='button'
                                                        onClick={() =>
                                                            onDeleteFileClicked(
                                                                file.key,
                                                            )
                                                        }
                                                        className='absolute right-2 top-2 size-[25px] items-center justify-center rounded-full text-foreground'
                                                    >
                                                        <X />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    <AttachFiles />
                                </>
                            </FormControl>
                            <FormDescription>
                                You can attach pdf, video, image or youtube. max
                                2 files.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className=''
                    disabled={status === 'executing'}
                    type='submit'
                >
                    Publish
                </Button>
            </form>
        </Form>
    );
};
export default LearningMaterialForm;
