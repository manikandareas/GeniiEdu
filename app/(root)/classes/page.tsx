import GridContainer from '@/common/components/elements/GridContainer';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import { getStudentClasses, getTeacherClasses } from '@/actions/users.actions';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import ExplorerClasses from './_components/ExplorerClasses';
import StudentSection from './_components/StudentSection';
import HeaderOptions from '@/common/components/elements/HeaderOptions';
import TeacherTabs from './_components/TeacherSection';

type ClassesPageProps = {};

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { user } = await validateRequest();

    if (!user) return redirect('/login');

    const queryClient = new QueryClient();

    if (user.role === 'student') {
        await queryClient.prefetchQuery({
            queryKey: ['classes'],
            queryFn: getStudentClasses,
        });
    } else {
        await queryClient.prefetchQuery({
            queryKey: ['classes'],
            queryFn: getTeacherClasses,
        });
    }

    const titlePage = user.role !== 'teacher' ? 'Classes' : 'Manage Classes';

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
                <GridContainer>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentSection />
                    </HydrationBoundary>
                    <ExplorerClasses />
                </GridContainer>
            )}

            {user.role === 'teacher' && (
                <main className='grid flex-1 items-start gap-4 bg-background p-4 sm:px-6 sm:py-0 md:gap-8'>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TeacherTabs />
                    </HydrationBoundary>
                </main>
            )}
        </>
    );
};
export default ClassesPage;
