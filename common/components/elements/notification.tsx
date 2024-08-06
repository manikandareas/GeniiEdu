'use client';
import { GetUserNotificationsResponse } from '@/actions/users.actions';
import { cn, formatDate } from '@/common/libs/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { BellIcon, CheckCheckIcon, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Typography from '../ui/typography';
import { InferResultType } from '@/common/data-access/types';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { markNotificationAsRead } from '@/actions/notifications.actions';
import { toast } from 'sonner';

type NotificationProps = {
    notifications: GetUserNotificationsResponse;
    invalidate: () => void;
};

const Notification = (props: NotificationProps) => {
    const unreadNotifications = props.notifications.filter(
        (not) => !not.isRead,
    );

    const { executeAsync, isExecuting } = useAction(markNotificationAsRead, {
        onSuccess: ({ data }) => {
            toast.success(data?.message);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    const onMarkAllAsRead = () => {
        executeAsync(unreadNotifications.map((not) => not.id));
        props.invalidate();
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className='relative' variant={'ghost'} size={'icon'}>
                    <BellIcon size={20} />
                    <span
                        className={cn(
                            'absolute right-0 top-0 inline-flex size-4 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground',
                            { hidden: unreadNotifications.length === 0 },
                        )}
                    >
                        {unreadNotifications.length}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align='end'
                className='w-[26rem] rounded-lg border bg-card p-0 shadow-lg'
            >
                <div className='flex items-center justify-between px-4 py-2'>
                    <Typography variant={'h4'}>Notifications</Typography>
                    <PopoverClose asChild>
                        <Button size={'icon'} variant='ghost'>
                            <X size={18} />
                        </Button>
                    </PopoverClose>
                </div>

                <Tabs defaultValue='all'>
                    <TabsList className='bg-transparent px-4'>
                        <TabsTrigger
                            value='all'
                            className='rounded-none border-b bg-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent'
                        >
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value='unread'
                            className='rounded-none border-b bg-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent'
                        >
                            Unread
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='all' className='divide-y'>
                        {props.notifications.map((not) => (
                            <NotificationItem
                                key={not.userId + not.id}
                                {...not}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value='unread'></TabsContent>
                </Tabs>

                <div className='flex items-center justify-between px-4 py-2'>
                    <div className='flex items-center gap-2'>
                        <Settings size={18} className='text-green-500' />
                        <Button
                            className='text-xs text-green-500'
                            variant={'ghost'}
                            onClick={onMarkAllAsRead}
                            title={
                                unreadNotifications.length === 0
                                    ? 'No unread notifications'
                                    : 'Mark all as read'
                            }
                            disabled={
                                isExecuting || unreadNotifications.length === 0
                            }
                        >
                            <CheckCheckIcon className='mr-1.5' size={18} /> Mark
                            all as read
                        </Button>
                    </div>

                    <Link
                        className={cn(
                            buttonVariants({
                                className: 'text-xs',
                            }),
                        )}
                        href='/notifications'
                    >
                        View all notifications
                    </Link>
                </div>

                {/* <Separator /> */}
            </PopoverContent>
        </Popover>
    );
};
export default Notification;
type NotificationItemProps = InferResultType<'notifications'>;
const NotificationItem: React.FC<NotificationItemProps> = (props) => {
    const router = useRouter();
    const handleNavigate = () => {
        if (props.url) {
            router.push(props.url);
        }
    };
    return (
        <div onClick={handleNavigate} className='px-4 py-2'>
            <div className='flex items-center justify-between'>
                <p
                    className={cn('text-sm font-semibold md:text-lg', {
                        'text-muted-foreground': props.isRead,
                    })}
                >
                    {props.title}
                </p>

                <span className='text-xs'>
                    {formatDate(props.createdAt ?? new Date(), false)}
                </span>
            </div>
            <Typography className='max-w-[75%] text-xs text-gray-500'>
                {props.message}
            </Typography>
        </div>
    );
};
