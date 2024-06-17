'use client';
import { onboardingProfile } from '@/actions/user.actions';
import { cn } from '@/common/libs/utils';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import {
    notFound,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { useSession } from '../providers/SessionProvider';
export function OnboardingTabs() {
    const { user } = useSession();

    console.log({ user });

    const [activeForm, setActiveForm] = useState(0);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleChange = useDebounceCallback(
        (term: any, key: 'username' | 'name' | 'role') => {
            console.log(`${key}}... ${term}`);

            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set(key, term);
            } else {
                params.delete(key);
            }
            replace(`${pathname}?${params.toString()}`);
        },
        0,
    );

    useEffect(() => {
        const addAttributesFromOauth = async () => {
            if (!user) return;
            if (!user?.name || !user?.username) return;

            const params = new URLSearchParams(searchParams);

            params.set('name', user.name);
            params.set('username', user.username);

            replace(`${pathname}?${params.toString()}`);
        };

        addAttributesFromOauth();

        return () => {};
    }, [user]);

    switch (activeForm) {
        case 0:
            return (
                <section className='max-w-md'>
                    <div className='mb-8 space-y-2'>
                        <p className='text-xl font-semibold'>
                            Step {activeForm + 1}/3
                        </p>
                        <h1 className='text-2xl font-bold sm:text-3xl'>
                            Please input your name 🔍
                        </h1>
                        <p className='text-muted-foreground'>
                            Enter your name so other friends can get to know
                            you.
                        </p>
                    </div>

                    <Input
                        className='mb-8 px-4 py-2'
                        placeholder='Vito Andareas Manik'
                        value={searchParams.get('name') || ''}
                        onChange={(e) => handleChange(e.target.value, 'name')}
                    />

                    <div className='flex w-full justify-end'>
                        <Button
                            disabled={!searchParams.get('name')}
                            onClick={() => setActiveForm((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </section>
            );

        case 1:
            return (
                <section className='max-w-md'>
                    <div className='mb-8 space-y-2'>
                        <div className='flex items-center justify-between'>
                            <button
                                onClick={() =>
                                    setActiveForm((prev) => prev - 1)
                                }
                            >
                                <ChevronLeft />
                            </button>
                        </div>
                        <p className='text-xl font-semibold'>
                            Step {activeForm + 1}/3
                        </p>
                        <h1 className='text-2xl font-bold sm:text-3xl'>
                            Now input your username for public profile 🔍
                        </h1>
                        <p className='text-muted-foreground'>
                            Fill in your username so that other people can
                            easily find you.
                        </p>
                    </div>

                    <Input
                        className='mb-8 px-4 py-2'
                        placeholder='manikandareas'
                        value={searchParams.get('username') || ''}
                        onChange={(e) =>
                            handleChange(e.target.value, 'username')
                        }
                    />

                    <div className='flex w-full justify-end'>
                        <Button
                            disabled={!searchParams.get('username')}
                            onClick={() => setActiveForm((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </section>
            );
        case 2:
            return (
                <section className='max-w-md'>
                    <button onClick={() => setActiveForm((prev) => prev - 1)}>
                        <ChevronLeft />
                    </button>
                    <p className='text-xl font-semibold'>
                        Step {activeForm + 1}/3
                    </p>
                    <h1 className='text-2xl font-bold sm:text-3xl'>
                        Last but not least, select your role 🥳
                    </h1>

                    <div className='mb-8 flex items-center justify-center gap-x-8'>
                        <button
                            onClick={() => handleChange('student', 'role')}
                            className={cn(
                                'flex flex-col items-center rounded-xl border border-primary bg-secondary p-2 transition-all ease-in-out',
                                {
                                    'border-green-500':
                                        searchParams.get('role') === 'student',
                                },
                            )}
                        >
                            <Image
                                width={150}
                                height={150}
                                alt='student'
                                src={
                                    'https://img.icons8.com/external-konkapp-outline-color-konkapp/150/external-student-back-to-school-konkapp-outline-color-konkapp.png'
                                }
                            />
                            <p className='text-2xl font-semibold'>Student</p>
                        </button>
                        <button
                            onClick={() => handleChange('teacher', 'role')}
                            className={cn(
                                'flex flex-col items-center rounded-xl border border-primary bg-secondary p-2 transition-all ease-in-out',
                                {
                                    'border-green-500':
                                        searchParams.get('role') === 'teacher',
                                },
                            )}
                        >
                            <Image
                                width={150}
                                height={150}
                                alt='teacher'
                                src={
                                    'https://img.icons8.com/external-fauzidea-flat-fauzidea/150/external-teacher-online-learning-fauzidea-flat-fauzidea.png'
                                }
                            />
                            <p className='text-2xl font-medium'>Teacher</p>
                        </button>
                    </div>

                    <div className='flex w-full justify-end'>
                        <OnboardingDialog />
                    </div>
                </section>
            );

        default:
            return notFound();
    }
}

export const OnboardingDialog = () => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const onSaveClicked = async () => {
        const values = {
            name: searchParams.get('name') as string,
            username: searchParams.get('username') as string,
            role: searchParams.get('role') as 'teacher' | 'student',
        };

        setIsLoading(true);
        const res = await onboardingProfile(values);

        if (!res.success) {
            toast.error(res.error);
            setIsLoading(false);
            return;
        }

        toast.success(res.message);
        router.push('/');
        setIsLoading(false);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={!searchParams.get('role')} variant='default'>
                    Save
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Onboarding</DialogTitle>
                    <DialogDescription>
                        Check again your input, make sure it is correct or you
                        can edit it later.
                    </DialogDescription>
                </DialogHeader>
                <div className='gap-6 py-4'>
                    <h1 className='text-muted-foreground'>
                        Name{' '}
                        <span className='text-foreground'>
                            {searchParams.get('name')}
                        </span>
                    </h1>
                    <h1 className='text-muted-foreground'>
                        Username{' '}
                        <span className='text-foreground'>
                            {searchParams.get('username')}
                        </span>
                    </h1>
                    <h1 className='text-muted-foreground'>
                        Role{' '}
                        <span className='text-foreground'>
                            {searchParams.get('role')}
                        </span>
                    </h1>
                </div>
                <DialogFooter>
                    <Button
                        type='button'
                        disabled={isLoading}
                        onClick={onSaveClicked}
                    >
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
