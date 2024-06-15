'use client';
import {
    Home,
    LineChart,
    Package,
    Package2,
    Settings,
    ShoppingCart,
    Users2,
} from 'lucide-react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useSession } from '../providers/SessionProvider';

type SidebarProps = {};

const Sidebar: React.FC<SidebarProps> = () => {
    const { user } = useSession();
    return (
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
                <Link
                    href='#'
                    className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                >
                    <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
                    <span className='sr-only'>Acme Inc</span>
                </Link>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <Home className='h-5 w-5' />
                                <span className='sr-only'>Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Dashboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <ShoppingCart className='h-5 w-5' />
                                <span className='sr-only'>Orders</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Orders</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <Package className='h-5 w-5' />
                                <span className='sr-only'>Products</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Products</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <Users2 className='h-5 w-5' />
                                <span className='sr-only'>Customers</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Customers</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <LineChart className='h-5 w-5' />
                                <span className='sr-only'>Analytics</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Analytics</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href='#'
                                className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
                            >
                                <Settings className='h-5 w-5' />
                                <span className='sr-only'>Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='outline'
                            size='icon'
                            className='overflow-hidden rounded-full'
                        >
                            <Image
                                src={user?.profilePicture ?? ''}
                                width={36}
                                height={36}
                                alt='Avatar'
                                className='overflow-hidden rounded-full'
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </aside>
    );
};
export default Sidebar;