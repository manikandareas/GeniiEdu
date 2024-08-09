'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/common/libs/utils';
import { Button, buttonVariants } from '@/common/components/ui/button';
import { Calendar } from '@/common/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/common/components/ui/command';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/common/components/ui/popover';
import { toast } from 'sonner';
import {
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    SortAsc,
} from 'lucide-react';
import { UsersModel } from '@/common/models';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { useAction } from 'next-safe-action/hooks';
import { updateAccountSchema } from '@/common/models/users.model';
import { updateUserAccount } from '@/actions/users.actions';
import { Password } from '@/common/components/ui/password';

const languages = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Spanish', value: 'es' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Chinese', value: 'zh' },
] as const;

// const accountFormSchema = z.object({
//     name: z
//         .string()
//         .min(2, {
//             message: 'Name must be at least 2 characters.',
//         })
//         .max(30, {
//             message: 'Name must not be longer than 30 characters.',
//         }),
//     dob: z.date({
//         required_error: 'A date of birth is required.',
//     }),
//     language: z.string({
//         required_error: 'Please select a language.',
//     }),
// });

type AccountFormValues = z.infer<typeof UsersModel.updateAccountSchema>;

export function AccountForm() {
    const user = useCurrentUser();
    const defaultValues: Partial<AccountFormValues> = {
        // name: "Your name",
        // dob: new Date("2023-01-23"),
        confirmPassword: '',
        name: user?.name,
        currentPassword: '',
        newPassword: '',
    };
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(UsersModel.updateAccountSchema),
        defaultValues,
    });

    const { executeAsync, isExecuting } = useAction(updateUserAccount, {
        onSuccess: ({ data }) => {
            toast.success(data?.message);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });
    async function onSubmit(data: AccountFormValues) {
        // toast('You submitted the following values:', {
        //     description: (
        //         <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
        //             <code className='text-white'>
        //                 {JSON.stringify(data, null, 2)}
        //             </code>
        //         </pre>
        //     ),
        // });
        await executeAsync(data);
    }

    // create variable type boolean to check if form filled by user and the value different with the default value

    // create variable bellow for check if isFormFilled one of the value is true
    const isFormFilled = Object.values(form.formState.dirtyFields).some(
        (value) => value,
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder='Your name' {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed on your
                                profile and in emails.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='currentPassword'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Password placeholder='********' {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter your password when you want to
                                update your password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Update Password</FormLabel>
                            <FormControl>
                                <Password placeholder='********' {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter your new password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem className='flex flex-col'>
                            <FormLabel>Confirmation Password</FormLabel>
                            <FormControl>
                                <Password placeholder='********' {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter your new password again to confirm.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Font</FormLabel>
                            <div className='relative w-max'>
                                <FormControl>
                                    <select
                                        className={cn(
                                            buttonVariants({
                                                variant: 'outline',
                                            }),
                                            'w-[200px] appearance-none font-normal',
                                        )}
                                        {...field}
                                    >
                                        {languages.map((language) => (
                                            <option
                                                key={language.value}
                                                value={language.value}
                                            >
                                                {language.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <ChevronDownIcon className='absolute right-3 top-2.5 h-4 w-4 opacity-50' />
                            </div>
                            <FormDescription>
                                This is the language that will be used in the
                                dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <Button disabled={isExecuting || !isFormFilled} type='submit'>
                    Update account
                </Button>
            </form>
        </Form>
    );
}
