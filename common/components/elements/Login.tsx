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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Password } from '../ui/password';

import { signIn } from '@/actions/auth.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import ContinueWithGithub from './ContinueWithGithub';
import ContinueWithGoogle from './ContinueWithGoogle';

const Login = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const LoginForm = useForm<z.infer<typeof AuthModel.loginUserSchema>>({
        resolver: zodResolver(AuthModel.loginUserSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmitClick = async (
        values: z.infer<typeof AuthModel.loginUserSchema>,
    ) => {
        setIsLoading(true);

        const response = await signIn(values);
        if (!response.success) {
            console.error(JSON.stringify(response.error, null, 2));
            setIsLoading(false);
            toast.error(response.error);
            return;
        }

        toast.success(response.message);
        router.push('/');
        setIsLoading(false);
        return;
    };
    return (
        <div className='z-10 mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8'>
            <h2 className='text-xl font-bold text-neutral-800 dark:text-neutral-200'>
                Welcome back to{' '}
                <span className='rotate-180 text-2xl underline decoration-primary decoration-[3px] underline-offset-2'>
                    GeniiEdu
                </span>
            </h2>
            <p className='mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300'>
                Login to aceternity if you can because we don&apos;t have a
                login flow yet
            </p>

            <Form {...LoginForm}>
                <form
                    onSubmit={LoginForm.handleSubmit(onSubmitClick)}
                    className='mt-4 space-y-4'
                >
                    <FormField
                        control={LoginForm.control}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={LoginForm.control}
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
                                <Link
                                    className='block text-right text-xs text-primary underline'
                                    href={'/forgot-password'}
                                >
                                    Forgot Password
                                </Link>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        className='w-full'
                        type='submit'
                        disabled={isLoading}
                    >
                        Sign In
                    </Button>
                    <span className='mt-2 text-xs text-muted-foreground'>
                        Don&apos;t have an account?{' '}
                        <Link
                            href={'/register'}
                            className='text-primary underline'
                        >
                            Sign Up
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

export default Login;
