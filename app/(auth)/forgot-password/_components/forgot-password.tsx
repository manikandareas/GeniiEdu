'use client';
import { Input } from '@/common/components/ui/input';

import { AuthModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/common/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/common/components/ui/form';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/common/components/ui/alert';
import { Terminal } from 'lucide-react';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const ForgotPasswordForm = useForm<
        z.infer<typeof AuthModel.resetPasswordSchema>
    >({
        resolver: zodResolver(AuthModel.resetPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmitClick = async (
        values: z.infer<typeof AuthModel.resetPasswordSchema>,
    ) => {
        try {
            setIsLoading(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            toast.error(err.error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className='relative z-10 mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8'>
            <Alert
                variant='destructive'
                className='absolute -top-20 left-0 right-0'
            >
                <Terminal className='h-4 w-4' />
                <AlertTitle>Warning!</AlertTitle>
                <AlertDescription>
                    Forgot Password Page is currently in development.
                </AlertDescription>
            </Alert>
            <h2 className='text-xl font-bold text-neutral-800 dark:text-neutral-200'>
                Forgot your{' '}
                <span className='rotate-180 text-2xl underline decoration-primary decoration-[3px] underline-offset-2'>
                    Password?
                </span>
            </h2>
            <p className='mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300'>
                Enter your email bellow to receive a password reset link.
            </p>

            <Form {...ForgotPasswordForm}>
                <form
                    onSubmit={ForgotPasswordForm.handleSubmit(onSubmitClick)}
                    className='mt-4 space-y-4'
                >
                    <FormField
                        control={ForgotPasswordForm.control}
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

                    <Button className='w-full' type='submit' disabled>
                        Reset Password
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
                </form>
            </Form>
        </div>
    );
};

export default ForgotPassword;
