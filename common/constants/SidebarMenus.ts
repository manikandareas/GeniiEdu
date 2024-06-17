import {
    Home,
    Settings,
    ShoppingCart,
    Users2,
    School2,
    BotMessageSquare,
    Library,
} from 'lucide-react';

export const StudentMenu = [
    {
        name: 'Dashboard',
        href: '/',
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
        name: 'Ask Ai',
        href: '/chatbot',
        icon: BotMessageSquare,
    },
];

export const TeacherMenu = [
    {
        name: 'Dashboard',
        href: '/',
        icon: Home,
    },
    {
        name: 'Classes',
        href: '/classes',
        icon: School2,
    },
    {
        name: 'Ask Ai',
        href: '/chatbot',
        icon: BotMessageSquare,
    },
];
