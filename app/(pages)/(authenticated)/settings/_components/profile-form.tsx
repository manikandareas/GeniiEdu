'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUserProfile } from '@/app/_actions/users-actions';
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
import { Textarea } from '@/app/_components/ui/textarea';
import useCurrentUser from '@/app/_hooks/current-user';
import { updateProfileValidation } from '@/app/_validations/users-validation';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

// const profileFormSchema = z.object({
//     username: z
//         .string()
//         .min(2, {
//             message: 'Username must be at least 2 characters.',
//         })
//         .max(30, {
//             message: 'Username must not be longer than 30 characters.',
//         }),
//     email: z
//         .string({
//             required_error: 'Please select an email to display.',
//         })
//         .email(),
//     bio: z.string().max(160).min(4),
//     urls: z
//         .array(
//             z.object({
//                 value: z.string().url({ message: 'Please enter a valid URL.' }),
//             }),
//         )
//         .optional(),
// });

type ProfileFormValues = z.infer<typeof updateProfileValidation>;

/**
 * Renders a form for updating the user's profile.
 */
export function ProfileForm() {
    const user = useCurrentUser();

    // This can come from your database or API.
    const defaultValues: Partial<ProfileFormValues> = {
        bio: user?.bio,
        // urls: [
        //     { value: 'https://shadcn.com' },
        //     { value: 'http://twitter.com/shadcn' },
        // ],
        email: user?.email,
        username: user?.username,
    };
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(updateProfileValidation),
        defaultValues,
        mode: 'onChange',
    });

    const { executeAsync, isExecuting } = useAction(updateUserProfile, {
        onSuccess: () => {
            toast.success('Profile updated successfully');
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    async function onSubmit(data: ProfileFormValues) {
        // toast.success('You submitted the following values:', {
        //     description: (
        //         <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
        //             <code className='text-white'>
        //                 {JSON.stringify(data, null, 2)}
        //             </code>
        //         </pre>
        //     ),
        // });
        await executeAsync({
            bio: data.bio,
            email: data.email,
            username: data.username,
        });
    }
    const isFormFilled = Object.values(form.formState.dirtyFields).some(
        (value) => value,
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder='shadcn' {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name. It can be your
                                real name or a pseudonym. You can only change
                                this once every 30 days.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='johnDoe@example.com'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your email address. It will be used for
                                communication and account-related notifications.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='bio'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Tell us a little bit about yourself'
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                You can <span>@mention</span> other users and
                                organizations to link to them.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <div>
                    {fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`urls.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        className={cn(index !== 0 && 'sr-only')}
                                    >
                                        URLs
                                    </FormLabel>
                                    <FormDescription
                                        className={cn(index !== 0 && 'sr-only')}
                                    >
                                        Add links to your website, blog, or
                                        social media profiles.
                                    </FormDescription>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='mt-2'
                        onClick={() => append({ value: '' })}
                    >
                        Add URL
                    </Button>
                </div> */}
                <Button disabled={isExecuting || !isFormFilled} type='submit'>
                    {isExecuting ? 'Updating...' : 'Update profile'}
                </Button>
            </form>
        </Form>
    );
}
