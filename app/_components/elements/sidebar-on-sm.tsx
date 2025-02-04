'use client';
import { STUDENT_MENU, TEACHER_MENU } from '@/app/_constants/sidebar-menus';
import { cn } from '@/app/_utilities';
import { PanelLeft } from 'lucide-react';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiDuolingo } from 'react-icons/si';
import { useSession } from '@/app/_providers/session-provider';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import AppLogo from '../ui/app-logo';

type SidebarOnSMProps = {};

const SidebarOnSM: React.FC<SidebarOnSMProps> = () => {
    const { user } = useSession();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' variant='outline' className='lg:hidden'>
                    <PanelLeft className='h-5 w-5' />
                    <span className='sr-only'>Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
                <nav className='grid gap-6 text-lg font-medium'>
                    <AppLogo />
                    {user?.role === 'student'
                        ? STUDENT_MENU.map((menu) => (
                              <SidebarOnSMItem key={nanoid(5)} {...menu} />
                          ))
                        : TEACHER_MENU.map((menu) => (
                              <SidebarOnSMItem key={nanoid(5)} {...menu} />
                          ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};
export default SidebarOnSM;

type SidebarOnSMItemProps = {
    href: string;
    name: string;
    icon: React.ElementType;
};

export const SidebarOnSMItem: React.FC<SidebarOnSMItemProps> = (props) => {
    const pathname = usePathname();
    return (
        <Link
            href={props.href}
            className={cn(
                'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                {
                    'text-foreground': pathname === props.href,
                },
            )}
        >
            <props.icon className='h-5 w-5' />
            {props.name}
        </Link>
    );
};
