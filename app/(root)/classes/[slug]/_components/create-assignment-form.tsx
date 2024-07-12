'use client';
import Tiptap from '@/common/components/elements/tiptap';
import { UploadDropzone } from '@/common/components/elements/uploadthing';
import { Button } from '@/common/components/ui/button';
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
import { TimePeriodSelect } from '@/common/components/ui/time-period-select';
import { TimePickerInput } from '@/common/components/ui/time-picker-input';
import { Period } from '@/common/components/ui/time-picker-utils';
import { DETAILS_CLASS_ICONS } from '@/common/constants/details-class-tabs';
import { AssignmentsModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CreateAssignmentFormProps = {};

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = () => {
    const createAssignmentForm = useForm<
        z.infer<typeof AssignmentsModel.createAssignmentSchema>
    >({
        resolver: zodResolver(AssignmentsModel.createAssignmentSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: new Date(),
            filePath: '',
            publishedAt: new Date(),
        },
    });

    const minuteRef = useRef<HTMLInputElement>(null);
    const hourRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const periodRef = useRef<HTMLButtonElement>(null);
    const [date, setDate] = useState<Date>();
    const [period, setPeriod] = useState<Period>('PM');

    const onCreateAssignmentClicked = async (
        values: z.infer<typeof AssignmentsModel.createAssignmentSchema>,
    ) => {
        console.log(values);
    };

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
                            name='filePath'
                            control={createAssignmentForm.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        File Path
                                        <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <UploadDropzone endpoint='learningMaterialsFileUploader' />
                                    </FormControl>
                                    <FormDescription>
                                        The file path of your learning material.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Publish Date</FormLabel>

                            <div className='flex flex-wrap items-end gap-2 lg:flex-nowrap'>
                                <div className='grid gap-1 text-start'>
                                    <Label htmlFor='hours' className='text-xs'>
                                        Date
                                    </Label>
                                    <DatePicker date={date} setDate={setDate} />
                                </div>
                                <div className='grid gap-1 text-center'>
                                    <Label htmlFor='hours' className='text-xs'>
                                        Hours
                                    </Label>
                                    <TimePickerInput
                                        picker='12hours'
                                        period={period}
                                        date={date}
                                        setDate={setDate}
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
                                        date={date}
                                        setDate={setDate}
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
                                        date={date}
                                        setDate={setDate}
                                        ref={secondRef}
                                        onLeftFocus={() =>
                                            minuteRef.current?.focus()
                                        }
                                    />
                                </div>
                                <div className='grid gap-1 text-center'>
                                    <Label htmlFor='period' className='text-xs'>
                                        Period
                                    </Label>
                                    <TimePeriodSelect
                                        period={period}
                                        setPeriod={setPeriod}
                                        date={date}
                                        setDate={setDate}
                                        ref={periodRef}
                                        onLeftFocus={() =>
                                            secondRef.current?.focus()
                                        }
                                    />
                                </div>
                            </div>
                            <FormDescription>
                                By default, the assignment will be published
                                immediately.
                            </FormDescription>
                        </FormItem>
                        <FormItem>
                            <FormLabel>Due date of assignment</FormLabel>

                            <div className='flex flex-wrap items-end gap-2 lg:flex-nowrap'>
                                <div className='grid gap-1 text-start'>
                                    <Label htmlFor='hours' className='text-xs'>
                                        Date
                                    </Label>
                                    <DatePicker date={date} setDate={setDate} />
                                </div>
                                <div className='grid gap-1 text-center'>
                                    <Label htmlFor='hours' className='text-xs'>
                                        Hours
                                    </Label>
                                    <TimePickerInput
                                        picker='12hours'
                                        period={period}
                                        date={date}
                                        setDate={setDate}
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
                                        date={date}
                                        setDate={setDate}
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
                                        date={date}
                                        setDate={setDate}
                                        ref={secondRef}
                                        onLeftFocus={() =>
                                            minuteRef.current?.focus()
                                        }
                                    />
                                </div>
                                <div className='grid gap-1 text-center'>
                                    <Label htmlFor='period' className='text-xs'>
                                        Period
                                    </Label>
                                    <TimePeriodSelect
                                        period={period}
                                        setPeriod={setPeriod}
                                        date={date}
                                        setDate={setDate}
                                        ref={periodRef}
                                        onLeftFocus={() =>
                                            secondRef.current?.focus()
                                        }
                                    />
                                </div>
                            </div>
                            <FormDescription>
                                By default, the assignment will&apos;t have a
                                due date.
                            </FormDescription>
                        </FormItem>

                        <SheetFooter>
                            <Button
                                type='button'
                                onClick={() => createAssignmentForm.reset()}
                                variant='ghost'
                            >
                                Reset
                            </Button>
                            <Button type='submit'>Create</Button>
                            <SheetClose asChild>
                                <Button variant='ghost' className='sr-only'>
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
