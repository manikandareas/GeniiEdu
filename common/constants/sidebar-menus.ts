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
        disabled: false,
        icon: Home,
    },
    {
        name: 'Classes',
        href: '/classes',
        disabled: false,
        icon: School2,
    },
    {
        name: 'Assignments',
        href: '/assignments',
        disabled: false,
        icon: Library,
    },
    {
        name: 'Genii Chat',
        href: '/genii-chat',
        disabled: true,
        icon: BotMessageSquare,
    },
];

export const TEACHER_MENU = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        disabled: false,
        icon: Home,
    },
    {
        name: 'Manage Classes',
        href: '/classes',
        disabled: false,
        icon: School2,
    },

    {
        name: 'Genii Chat',
        href: '/genii-chat',
        disabled: true,
        icon: BotMessageSquare,
    },
];
