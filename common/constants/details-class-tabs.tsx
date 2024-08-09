import {
    ClipboardList,
    FolderKanbanIcon,
    NotebookText,
    Shapes,
} from 'lucide-react';

type TabsTriggerClassProps = {
    value: string;
    children: React.ReactNode;
};

export const DETAILS_CLASS_ICONS = {
    aboutClass: {
        icon: Shapes,
        color: 'text-rose-500',
    },
    forum: {
        icon: FolderKanbanIcon,
        color: 'text-green-500',
    },
    assignments: {
        icon: ClipboardList,
        color: 'text-yellow-500',
    },
    learningMaterials: {
        icon: NotebookText,
        color: 'text-blue-500',
    },
};

export const TABS_TRIGGER_CLASS: TabsTriggerClassProps[] = [
    {
        children: (
            <>
                <DETAILS_CLASS_ICONS.aboutClass.icon
                    className='text-rose-500'
                    size={18}
                />

                <span className='hidden lg:inline'>About Class</span>
            </>
        ),
        value: 'aboutClass',
    },
    {
        children: (
            <>
                <DETAILS_CLASS_ICONS.forum.icon
                    className='text-green-500'
                    size={18}
                />
                <span className='hidden lg:inline'>Forum</span>
            </>
        ),
        value: 'forum',
    },
    {
        children: (
            <>
                <DETAILS_CLASS_ICONS.assignments.icon
                    className='text-yellow-500'
                    size={18}
                />
                <span className='hidden lg:inline'>Assignments</span>
            </>
        ),
        value: 'assignments',
    },
];
