import PageHeader from '@/app/_components/elements/page-header';
import { detailsAssignmentQuery } from '@/app/_hooks/query/details-assignment-query';
import { validateRequest } from '@/app/_libs/lucia';
import { decodeUuid } from '@/app/_utilities';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import StudentSection from './components/student/student-section';
import { InputGradeContextProvider } from './components/teacher/input-grade-context';
import TeacherSection from './components/teacher/teacher-section';
import UpdateAssignmentForm from './components/teacher/update-assignment-form';
import { getDetailsAssignment } from '@/app/_actions/assignments-actions';

type DetailClassAssignmentProps = {
    params: {
        assignmentSlug: string;
        slug: string;
    };
};

const DetailClassAssignment: React.FC<DetailClassAssignmentProps> = async ({
    params,
}) => {
    const { user } = await validateRequest();

    if (!user) return notFound();

    const assignmentId = decodeUuid(params.assignmentSlug);

    if (!assignmentId) return notFound();

    const details = await getDetailsAssignment({
        id: assignmentId,
    });

    if (!details) return notFound();

    const { queryClient, prefetch } = detailsAssignmentQuery({
        assignmentId,
    });

    await prefetch();

    const urls = [
        {
            name: 'Dashboard',
            href: '/dashboard',
        },
        {
            name: 'Classes',
            href: '/classes',
        },
        {
            name: details.class.className,
            href: `/classes/${params.slug}`,
        },
        {
            name: 'Assignments',
            href: `/classes/${params.slug}/assignments/${params.assignmentSlug}`,
        },
    ];

    return (
        <>
            <PageHeader
                title='Assignment Details'
                urls={urls}
                actions={user.role === 'teacher' && <UpdateAssignmentForm />}
            />
            <HydrationBoundary state={dehydrate(queryClient)}>
                {user.role === 'student' ? (
                    <StudentSection initialData={details} />
                ) : (
                    <InputGradeContextProvider>
                        <TeacherSection initialData={details as any} />
                    </InputGradeContextProvider>
                )}
            </HydrationBoundary>
        </>
    );
};
export default DetailClassAssignment;
