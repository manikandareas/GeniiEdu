import { getUserClasses } from '@/app/_actions/users-actions';
import PageHeader from '@/app/_components/elements/page-header';
import { userClassesQuery } from '@/app/_hooks/query/user-classes-query';
import { validateRequest } from '@/app/_libs/lucia';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import ClassesContainer from './_components/classes-container';
import StudentTabs from './_components/student-tabs';
import TeacherTabs from './_components/teacher-tabs';

type ClassesPageProps = {};

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { user } = await validateRequest();

    if (!user) return redirect('/login');

    const titlePage = user.role !== 'teacher' ? 'Classes' : 'Manage Classes';

    const initialData = await getUserClasses();

    const { prefetch: prefetchUserClassesQuery, queryClient } =
        userClassesQuery();

    await prefetchUserClassesQuery();

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
            <PageHeader
                title={user.role === 'teacher' ? 'Manage Classes' : 'Classes'}
                urls={urls}
            />
            <ClassesContainer>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    {user.role === 'teacher' ? (
                        <TeacherTabs initialData={initialData} />
                    ) : (
                        <StudentTabs initialData={initialData} />
                    )}
                </HydrationBoundary>
            </ClassesContainer>
        </>
    );
};
export default ClassesPage;
