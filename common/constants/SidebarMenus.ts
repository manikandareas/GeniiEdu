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

export const StudentMenu = [
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

export const TeacherMenu = [
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
        name: 'Modules',
        href: '/modules',
        icon: Library,
    },

    {
        name: 'Genii Chat',
        href: '/genii-chat',
        icon: BotMessageSquare,
    },
];
