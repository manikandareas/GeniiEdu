'use client';
import { Input } from '@/app/_components/ui/input';

import { addUserValidation } from '@/app/_validations/auth-validation';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Password } from '@/app/_components/ui/password';
import { signUp } from '@/app/_actions/auth-actions';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useContinueWithOauth from '@/app/_hooks/continue-with-oauth';
import ContinueWithGithub from '@/app/_components/elements/continue-with-github';
import ContinueWithGoogle from '@/app/_components/elements/continue-with-google';

const Register = () => {
    const router = useRouter();

    const registerForm = useForm<z.infer<typeof addUserValidation>>({
        resolver: zodResolver(addUserValidation),
        defaultValues: {
            email: '',
            password: '',
            confirmationPassword: '',
        },
    });

    const { status, executeAsync } = useAction(signUp, {
        onSuccess: ({ data, input }) => {
            toast.success(data?.message);
            router.push(`/verify-email?email=${input.email}`);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    const { executeFn: continueWithGithub, status: statusContinueWithGithub } =
        useContinueWithOauth({
            provider: 'github',
        });

    const { executeFn: continueWithGoogle, status: statusContinueWithGoogle } =
        useContinueWithOauth({
            provider: 'google',
        });

    const onRegisterClicked = async (
        values: z.infer<typeof addUserValidation>,
    ) => {
        await executeAsync(values);
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
                        disabled={
                            (statusContinueWithGithub ||
                                statusContinueWithGoogle ||
                                status) === 'executing'
                        }
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
                            executeFn={continueWithGithub}
                            isLoading={
                                (statusContinueWithGithub ||
                                    statusContinueWithGoogle ||
                                    status) === 'executing'
                            }
                        />
                        <ContinueWithGoogle
                            executeFn={continueWithGoogle}
                            isLoading={
                                (statusContinueWithGithub ||
                                    statusContinueWithGoogle ||
                                    status) === 'executing'
                            }
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Register;
