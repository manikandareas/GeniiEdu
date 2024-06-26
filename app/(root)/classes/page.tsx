import GridContainer from '@/common/components/elements/GridContainer';
import { validateRequest } from '@/common/libs/lucia';
import { redirect } from 'next/navigation';
import { getStudentClasses } from '@/actions/users.actions';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import ExplorerClasses from './_components/ExplorerClasses';
import StudentSection from './_components/StudentSection';
import HeaderOptions from '@/common/components/elements/HeaderOptions';

type ClassesPageProps = {};

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Classes',
        href: '/classes',
    },
];

const ClassesPage: React.FC<ClassesPageProps> = async () => {
    const { user } = await validateRequest();

    if (!user) return redirect('/login');

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['classes'],
        queryFn: getStudentClasses,
    });

    return (
        <GridContainer>
            <HeaderOptions title='Classes' urls={urls} />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <StudentSection />
            </HydrationBoundary>
            <ExplorerClasses />
        </GridContainer>
    );
};
export default ClassesPage;
