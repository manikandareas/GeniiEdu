'use client';

import {
    resendEmailVerification,
    verifyEmail,
} from '@/app/_actions/auth-actions';
import { Button } from '@/app/_components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/app/_components/ui/form';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/app/_components/ui/input-otp';
import { verifyEmailValidation } from '@/app/_validations/auth-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCountdown } from 'usehooks-ts';
import { z } from 'zod';

type VerifyEmailProps = {
    email: string;
};

const VerifyEmail: React.FC<VerifyEmailProps> = (props) => {
    const form = useForm<z.infer<typeof verifyEmailValidation>>({
        resolver: zodResolver(verifyEmailValidation),
        defaultValues: {
            code: '',
        },
    });

    const [count, { startCountdown, stopCountdown, resetCountdown }] =
        useCountdown({
            countStart: 60,
            intervalMs: 1000,
        });

    useEffect(() => {
        if (count === 0) {
            stopCountdown();
            resetCountdown();
        }
    }, [count, stopCountdown, resetCountdown]);

    // @ts-ignore
    const boundEmailWithFn = verifyEmail.bind(null, props.email);

    const { executeAsync: executeVerifyEmail, status: verifyEmailStatus } =
        useAction(boundEmailWithFn, {
            onSuccess: ({ data }) => {
                toast.success(data?.message);
                router.push('/login');
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
            },
        });

    const { executeAsync: executeResend, status: resendStatus } = useAction(
        resendEmailVerification,
        {
            onSuccess: ({ data }) => {
                toast.success(data?.message);
                startCountdown();
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
                startCountdown();
            },
        },
    );

    const router = useRouter();

    const onVerifyClicked = async (
        values: z.infer<typeof verifyEmailValidation>,
    ) => {
        await executeVerifyEmail(values);
    };

    const onResendClicked = async () => {
        await executeResend(props.email);
    };

    useEffect(() => {
        startCountdown();
    }, [startCountdown]);
    return (
        <div className='z-10 mx-auto w-full max-w-md rounded-none bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8'>
            <h2 className='text-xl font-bold text-neutral-800 dark:text-neutral-200'>
                Verify your{' '}
                <span className='rotate-180 text-2xl underline decoration-primary decoration-[3px] underline-offset-2'>
                    Email
                </span>
            </h2>
            <p className='mt-2 w-full text-sm text-neutral-600 dark:text-neutral-300'>
                W&apos;ve sent a verification code to {props.email}.
            </p>

            <Form {...form}>
                <form
                    className='mt-4'
                    onSubmit={form.handleSubmit(onVerifyClicked)}
                >
                    <FormField
                        control={form.control}
                        name='code'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        {...field}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSeparator />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSeparator />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type='submit'
                        disabled={
                            (verifyEmailStatus || resendStatus) === 'executing'
                        }
                        className='mt-4 w-full'
                    >
                        Verify Email
                    </Button>
                    <span className='text-xs text-muted-foreground'>
                        Don&apos;t receive the code?{' '}
                        <Button
                            type='button'
                            disabled={
                                (count > 0 && count < 60) ||
                                (resendStatus || verifyEmailStatus) ===
                                    'executing'
                            }
                            onClick={onResendClicked}
                            variant={'link'}
                            className='w-fit p-0 text-xs'
                        >
                            Send verification email{' '}
                            {count > 0 && count < 60 && `in ${count}s`}
                        </Button>
                    </span>
                </form>
            </Form>
        </div>
    );
};

export default VerifyEmail;
