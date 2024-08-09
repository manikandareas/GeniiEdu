'use client';
import { STUDENT_MENU, TEACHER_MENU } from '@/app/_constants/sidebar-menus';
import { cn } from '@/app/_utilities';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiDuolingo } from 'react-icons/si';
import { useSession } from '@/app/_providers/session-provider';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import DropdownProfile from './dropdown-profile';

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
                    ? STUDENT_MENU.map((menu) => (
                          <SidebarItem key={nanoid(5)} {...menu} />
                      ))
                    : TEACHER_MENU.map((menu) => (
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
