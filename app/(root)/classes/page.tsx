import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import { getUserClasses } from '@/actions/users.actions';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';

import HeaderOptions from '@/common/components/elements/HeaderOptions';
import TeacherTabs from './_components/TeacherTabs';
import StudentTabs from './_components/StudentTabs';
import ClassesContainer from './_components/ClassesContainer';

type ClassesPageProps = {};

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { user } = await validateRequest();

    if (!user) return redirect('/login');

    const titlePage = user.role !== 'teacher' ? 'Classes' : 'Manage Classes';

    const initialData = await getUserClasses();

    const queryClient = new QueryClient();

    queryClient.prefetchQuery({
        queryKey: ['classes'],
        queryFn: () => getUserClasses(),
    });

    const urls = [
        {
            name: 'Dashboard',
            href: '/dashboard',
        },
        {
            name: titlePage,
            href: '/classes',
        },
    ];

    return (
        <>
            <HeaderOptions title={titlePage} urls={urls} />
            {user.role === 'student' && (
                <ClassesContainer>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentTabs initialData={initialData} />
                    </HydrationBoundary>
                </ClassesContainer>
            )}

            {user.role === 'teacher' && (
                <ClassesContainer>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TeacherTabs initialData={initialData} />
                    </HydrationBoundary>
                </ClassesContainer>
            )}
        </>
    );
};
export default ClassesPage;
