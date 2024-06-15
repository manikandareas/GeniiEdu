'use client';
import { Settings2 } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { signOut } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { revalidatePath } from 'next/cache';

export function Dashboard() {
    const date = new Date();

    const onSignOutClick = async () => {
        console.log('logging out');
        try {
            const response = await signOut();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    return (
        <div className='flex min-h-screen w-full flex-col bg-background'>
            <Sidebar />
            <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
                <Header />
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-10 lg:grid-cols-3 xl:grid-cols-4'>
                    <div className='flex auto-rows-max flex-col items-start gap-4 md:gap-8 lg:col-span-3 xl:col-span-3'>
                        {/* My Progress */}
                        <div className='grid gap-4'>
                            <div className='mb-3 flex items-center gap-3'>
                                <h1 className='text-xl font-semibold'>
                                    My Progress
                                </h1>
                                <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-primary-foreground dark:bg-slate-200'>
                                    10
                                </span>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
                                <Card
                                    className='sm:col-span-2'
                                    x-chunk='dashboard-05-chunk-0'
                                >
                                    <CardHeader className='pb-3'>
                                        <CardTitle>Your Orders</CardTitle>
                                        <CardDescription className='max-w-lg text-balance leading-relaxed'>
                                            Introducing Our Dynamic Orders
                                            Dashboard for Seamless Management
                                            and Insightful Analysis.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button>Create New Order</Button>
                                    </CardFooter>
                                </Card>
                                <Card x-chunk='dashboard-05-chunk-1'>
                                    <CardHeader className='pb-2'>
                                        <CardDescription>
                                            This Week
                                        </CardDescription>
                                        <CardTitle className='text-4xl'>
                                            $1,329
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-xs text-muted-foreground'>
                                            +25% from last week
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Progress
                                            value={25}
                                            aria-label='25% increase'
                                        />
                                    </CardFooter>
                                </Card>
                                <Card x-chunk='dashboard-05-chunk-2'>
                                    <CardHeader className='pb-2'>
                                        <CardDescription>
                                            This Month
                                        </CardDescription>
                                        <CardTitle className='text-4xl'>
                                            $5,329
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-xs text-muted-foreground'>
                                            +10% from last month
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Progress
                                            value={12}
                                            aria-label='12% increase'
                                        />
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                        <div className='flex w-full flex-col gap-8 lg:flex-row'>
                            <div className='flex-1 gap-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <h1 className='text-xl font-semibold'>
                                            Activity
                                        </h1>
                                        <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-primary-foreground dark:bg-slate-200'>
                                            3
                                        </span>
                                    </div>

                                    <Settings2 className='text-xl text-muted-foreground' />
                                </div>
                                <div>
                                    {/* Content */}
                                    <Button onClick={() => onSignOutClick()}>
                                        Log Out
                                    </Button>
                                </div>
                            </div>
                            <div className='flex-1 gap-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <h1 className='text-xl font-semibold'>
                                            Courses
                                        </h1>
                                        <span className='flex aspect-square w-5 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-primary-foreground dark:bg-slate-200'>
                                            5
                                        </span>
                                    </div>

                                    <Settings2 className='text-xl text-muted-foreground' />
                                </div>
                                <div>{/* Content */}</div>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <h1 className='mb-4 text-xl font-semibold'>
                            Scheduled
                        </h1>

                        <Calendar
                            mode='single'
                            selected={date}
                            // onSelect={setDate}
                            className='flex justify-center rounded-md'
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
