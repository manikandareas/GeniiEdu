'use client';
import { StudentMenu, TeacherMenu } from '@/common/constants/SidebarMenus';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import { SiDuolingo } from 'react-icons/si';
import { useSession } from '../providers/SessionProvider';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { usePathname } from 'next/navigation';
import { cn } from '@/common/libs/utils';
import DropdownProfile from './DropdownProfile';

type SidebarProps = {};

const Sidebar: React.FC<SidebarProps> = () => {
    const { user } = useSession();
    return (
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
            <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
                <Link
                    href='/'
                    className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
                >
                    <SiDuolingo className='h-4 w-4 transition-all group-hover:scale-110' />
                    <span className='sr-only'>Genii Edu</span>
                </Link>

                {user?.role === 'student'
                    ? StudentMenu.map((menu) => (
                          <SidebarItem key={nanoid(5)} {...menu} />
                      ))
                    : TeacherMenu.map((menu) => (
                          <SidebarItem key={nanoid(5)} {...menu} />
                      ))}
            </nav>
            <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
                <DropdownProfile />
            </nav>
        </aside>
    );
};
export default Sidebar;

export const SidebarItem = (props: {
    icon: React.ElementType;
    name: string;
    href: string;
}) => {
    const pathname = usePathname();
    return (
        <TooltipProvider key={nanoid(5)}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={props.href}
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                            {
                                'text-foreground': pathname === props.href,
                            },
                        )}
                    >
                        <props.icon className='h-5 w-5' />
                        <span className='sr-only'>{props.name}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>{props.name}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};