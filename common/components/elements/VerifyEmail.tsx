'use client';

import { resendEmailVerification, verifyEmail } from '@/actions/auth.actions';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/common/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthModel } from '@/common/models';
import { useCountdown } from 'usehooks-ts';

type VerifyEmailProps = {
    email: string;
};

const VerifyEmail: React.FC<VerifyEmailProps> = (props) => {
    const form = useForm<z.infer<typeof AuthModel.verifyEmailSchema>>({
        resolver: zodResolver(AuthModel.verifyEmailSchema),
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
    }, [count]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const onVerifyClicked = async (
        values: z.infer<typeof AuthModel.verifyEmailSchema>,
    ) => {
        setIsLoading(true);

        const response = await verifyEmail(props.email, values);

        if (!response.success) {
            console.error(JSON.stringify(response.error, null, 2));
            toast.error(response.error);

            setIsLoading(false);
            return;
        }

        toast.success(response.message);
        setIsLoading(false);
        router.push('/login');
        return;
    };

    const onResendClicked = async () => {
        setIsLoading(true);
        const response = await resendEmailVerification(props.email);

        if (!response.success) {
            toast.error(response.error);
            setIsLoading(false);
            startCountdown();
            return;
        }
        toast.success(response.message);

        setIsLoading(false);
        startCountdown();
    };

    useEffect(() => {
        startCountdown();
    }, []);
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

                    <Button className='mt-4 w-full'>Verify Email</Button>
                    <span className='text-xs text-muted-foreground'>
                        Don't receive the code?{' '}
                        <Button
                            type='button'
                            disabled={(count > 0 && count < 60) || isLoading}
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
