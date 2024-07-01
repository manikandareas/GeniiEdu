'use client';
import * as React from 'react';

import { cn } from '@/common/libs/utils';
import { useMediaQuery } from 'usehooks-ts';
import { Button } from '@/common/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/common/components/ui/drawer';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { DateTimePicker } from 'react-datetime-picker';

type AddToClassFormProps = {
    moduleName: string;
    moduleId: string;
};

const AddToClassForm: React.FC<AddToClassFormProps> = ({
    moduleName,
    moduleId,
}) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const description = `Add module ${moduleName} to your class.`;

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline'>Add Class</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Add to Class</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <AddForm moduleId={moduleId} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant='outline'>Add Class</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className='text-left'>
                    <DrawerTitle>Add to Class</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <AddForm className='px-4' moduleId={moduleId} />
                <DrawerFooter className='pt-2'>
                    <DrawerClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default AddToClassForm;

type AddFormProps = React.ComponentProps<'form'> & {
    moduleId: string;
};
const AddForm: React.FC<AddFormProps> = ({ className, moduleId }) => {
    const defaultPublish = React.useMemo(() => {
        const localDate = new Date();
        const formattedDate = localDate
            .toLocaleString('sv-SE', {
                timeZoneName: 'short',
                hour12: false,
            })
            .replace(' ', 'T')
            .slice(0, 16);
        return formattedDate;
    }, []);

    const form = useForm<z.infer<typeof addModuleSchema>>({
        resolver: zodResolver(addModuleSchema),
        defaultValues: {
            classId: '',
            moduleId,
            publishedAt: defaultPublish,
        },
    });

    const { execute, isExecuting } = useAction(addModule, {
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

    function onSubmit(values: z.infer<typeof addModuleSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        execute(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'space-y-6'}
            >
                <FormField
                    control={form.control}
                    name='classId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <FormControl>
                                <ComboboxClass onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='publishedAt'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Publish Date</FormLabel>
                            <FormControl>
                                <Input type='datetime-local' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={isExecuting} className='w-full'>
                    Add
                </Button>
            </form>
        </Form>
    );
};

import { Check, ChevronsUpDown } from 'lucide-react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/common/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/common/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { getTeacherClasses } from '@/actions/users.actions';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addModuleSchema } from '@/common/models/classes.model';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/ui/form';
import { useAction } from 'next-safe-action/hooks';
import { addModule } from '@/actions/classes.actions';
import { toast } from 'sonner';

type ComboboxClassProps = {
    onChange: (value: string) => void;
};

export const ComboboxClass: React.FC<ComboboxClassProps> = ({ onChange }) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

    const ownClasses = useQuery({
        queryKey: ['classes'],
        queryFn: async () => await getTeacherClasses(),
    });

    React.useEffect(() => {
        if (value) {
            onChange(value);
            console.log(value);
        }
    }, [value, onChange]);

    if (ownClasses.isLoading || ownClasses.isError) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full justify-between'
                >
                    {value
                        ? ownClasses.data?.data?.find(
                              (classData) => classData.id === value,
                          )?.className
                        : 'Select class...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput placeholder='Search class...' />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {ownClasses.data?.data?.map((classData) => (
                                <CommandItem
                                    key={classData.id}
                                    value={classData.className}
                                    onSelect={() => {
                                        setValue(classData.id as string);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === classData.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {classData.className}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
