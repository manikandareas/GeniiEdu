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
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/common/components/ui/sheet';
import { LearningMaterialsModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { ElementRef, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CreateLMForm = () => {
    const closeSheetRef = useRef<ElementRef<'button'>>(null);

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

    const onCreateModuleClicked = async (
        values: z.infer<
            typeof LearningMaterialsModel.insertLearningMaterialsSchema
        >,
    ) => {};

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant={'outline'}
                    className='border-teal-500/40 bg-teal-600/10 text-teal-500 hover:bg-teal-600/20 hover:text-teal-600'
                >
                    <PlusCircle className='mr-2 inline' size={16} />
                    Learning Material
                </Button>
            </SheetTrigger>
            <SheetContent className='w-full overflow-y-scroll md:max-w-xl'>
                <SheetHeader>
                    <SheetTitle>Add Learning Material</SheetTitle>
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

                        <SheetFooter>
                            <Button
                                type='button'
                                onClick={() => createLMForm.reset()}
                                variant='ghost'
                            >
                                Reset
                            </Button>
                            <Button type='submit'>Create</Button>
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

export default CreateLMForm;
