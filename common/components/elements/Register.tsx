'use client';
import { Input } from '@/common/components/ui/input';

import { AuthModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Password } from '../ui/password';

import { signUp } from '@/actions/auth.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ContinueWithGithub from './ContinueWithGithub';
import ContinueWithGoogle from './ContinueWithGoogle';

const Register = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const registerForm = useForm<z.infer<typeof AuthModel.insertUserSchema>>({
        resolver: zodResolver(AuthModel.insertUserSchema),
        defaultValues: {
            // username: '',
            // role: 'student',
            email: '',
            password: '',
            confirmationPassword: '',
        },
    });

    const onRegisterClicked = async (
        values: z.infer<typeof AuthModel.insertUserSchema>,
    ) => {
        setIsLoading(true);

        const response = await signUp(values);
        if (!response.success) {
            console.error(JSON.stringify(response.error, null, 2));
            toast.error(response.error);
            setIsLoading(false);
            return;
        }

        toast.success(response.message);
        router.push(`/verify-email?email=${values.email}`);
        setIsLoading(false);
        return;
    };

    return (
        <div className='z-10 mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8'>
            <h2 className='text-xl font-bold text-neutral-800 dark:text-neutral-200'>
                Welcome to{' '}
                <span className='rotate-180 text-2xl underline decoration-primary decoration-[3px] underline-offset-2'>
                    GeniiEdu
                </span>
            </h2>
            <p className='mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300'>
                Login to aceternity if you can because we don&apos;t have a
                login flow yet
            </p>

            <Form {...registerForm}>
                <form
                    onSubmit={registerForm.handleSubmit(onRegisterClicked)}
                    className='mt-4 space-y-4'
                >
                    {/* <FormField
                        control={registerForm.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder='manikxixi' {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <FormField
                        control={registerForm.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={'manik@mail.com'}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Fill with your an active email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={registerForm.control}
                        name='role'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className='w-[200px]'>
                                        <SelectItem value='student'>
                                            Student
                                        </SelectItem>
                                        <SelectItem value='teacher'>
                                            Teacher
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select your role.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <FormField
                        control={registerForm.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Password
                                        placeholder='********'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Create your strong password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={registerForm.control}
                        name='confirmationPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmation Password</FormLabel>
                                <FormControl>
                                    <Password
                                        placeholder='********'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Confirm your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className='w-full'
                        type='submit'
                        disabled={isLoading}
                    >
                        Sign Up
                    </Button>
                    <span className='mt-2 text-xs text-muted-foreground'>
                        Already have an account?{' '}
                        <Link
                            href={'/login'}
                            className='text-primary underline'
                        >
                            Sign In
                        </Link>
                    </span>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='bg-background px-2 text-muted-foreground'>
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className='flex gap-1'>
                        <ContinueWithGithub
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                        <ContinueWithGoogle
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Register;
