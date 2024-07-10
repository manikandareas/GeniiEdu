import {
    Home,
    Settings,
    ShoppingCart,
    Users2,
    School2,
    BotMessageSquare,
    Library,
    ClipboardList,
} from 'lucide-react';

export const STUDENT_MENU = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'Classes',
        href: '/classes',
        icon: School2,
    },
    {
        name: 'Assignments',
        href: '/assignments',
        icon: Library,
    },
    {
        name: 'Genii Chat',
        href: '/genii-chat',
        icon: BotMessageSquare,
    },
];

export const TEACHER_MENU = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'Manage Classes',
        href: '/classes',
        icon: School2,
    },

    {
        name: 'Genii Chat',
        href: '/genii-chat',
        icon: BotMessageSquare,
    },
];
