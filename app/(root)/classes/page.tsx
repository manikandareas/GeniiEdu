import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import {
    GetStudentClasses,
    GetTeacherClasses,
    getStudentClasses,
    getTeacherClasses,
} from '@/actions/users.actions';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';

import HeaderOptions from '@/common/components/elements/HeaderOptions';
import TeacherTabs from './_components/TeacherTabs';
import StudentTabs from './_components/StudentTabs';

type ClassesPageProps = {};

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { user } = await validateRequest();

    if (!user) return redirect('/login');

    const titlePage = user.role !== 'teacher' ? 'Classes' : 'Manage Classes';

    const initialData =
        user.role === 'teacher'
            ? await getTeacherClasses()
            : await getStudentClasses();

    const queryClient = new QueryClient();

    if (user.role === 'teacher') {
        queryClient.prefetchQuery({
            initialData,
            queryKey: ['classes'],
            queryFn: () => getTeacherClasses(),
        });
    } else {
        queryClient.prefetchQuery({
            initialData,
            queryKey: ['classes'],
            queryFn: () => getStudentClasses(),
        });
    }

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
                <main className='grid flex-1 items-start gap-4 bg-background p-4 sm:px-6 sm:py-0 md:gap-8'>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <StudentTabs
                            initialData={initialData as GetStudentClasses}
                        />
                    </HydrationBoundary>
                </main>
            )}

            {user.role === 'teacher' && (
                <main className='grid flex-1 items-start gap-4 bg-background p-4 sm:px-6 sm:py-0 md:gap-8'>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <TeacherTabs
                            initialData={initialData as GetTeacherClasses}
                        />
                    </HydrationBoundary>
                </main>
            )}
        </>
    );
};
export default ClassesPage;
