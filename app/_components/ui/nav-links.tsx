import { STUDENT_MENU, TEACHER_MENU } from '@/app/_constants/sidebar-menus';
import { cn } from '@/app/_utilities';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type NavLinksProps = {
    role: 'student' | 'teacher';
    pathname: string;
};

const NavLinks: React.FC<NavLinksProps> = ({ role, pathname }) => {
    const LINKS = {
        student: STUDENT_MENU,
        teacher: TEACHER_MENU,
    };
    return (
        <ul className='flex items-center gap-3 text-sm text-muted-foreground'>
            {LINKS[role].map((item, key) => {
                if (item.disabled) {
                    return (
                        <li
                            className='text-muted-foreground/80 hover:cursor-not-allowed'
                            key={key}
                        >
                            {item.name}
                        </li>
                    );
                }
                return (
                    <li key={key}>
                        <Link
                            aria-disabled={item.disabled}
                            href={item.href}
                            className={cn('flex items-center gap-1.5', {
                                'text-foreground': pathname.includes(item.href),
                            })}
                        >
                            <span> {item.name}</span>
                        </Link>
                    </li>
                );
            })}
            {/* <li>
                <Link href='/dashboard' className='text-foreground'>
                    Dashboard
                </Link>
            </li>
            <li>
                <Link href='/classes' className=''>
                    Classes
                </Link>
            </li>
            <li>
                <Link href='/genii-chat' className=''>
                    Genii Chat
                </Link>
            </li> */}
        </ul>
    );
};
export default NavLinks;
