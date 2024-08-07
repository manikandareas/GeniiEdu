import PageHeader from '@/common/components/elements/page-header';
import {
    findDetailsAssignment,
    FindDetailsAssignmentForStudentResponse,
    FindDetailsAssignmentForTeacherResponse,
} from '@/common/data-access/assignments';
import { detailsAssignmentQuery } from '@/common/hooks/details-assignment-query';
import { validateRequest } from '@/common/libs/lucia';
import { decodeUuid } from '@/common/libs/utils';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import StudentSection from './components/student/student-section';
import { InputGradeContextProvider } from './components/teacher/input-grade-context';
import TeacherSection from './components/teacher/teacher-section';
import SwitchAssignmentStatus from './components/teacher/switch-assignment-status';
import UpdateAssignmentForm from './components/teacher/update-assignment-form';

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

    const details = await findDetailsAssignment({
        id: assignmentId,
        userId: user.id,
    });

    if (!details) return notFound();

    const { queryClient, prefetch } = detailsAssignmentQuery({
        assignmentId,
        userId: user.id,
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
                    <StudentSection
                        data={
                            details as FindDetailsAssignmentForStudentResponse
                        }
                    />
                ) : (
                    <InputGradeContextProvider>
                        <TeacherSection
                            initialData={
                                details! as FindDetailsAssignmentForTeacherResponse
                            }
                        />
                    </InputGradeContextProvider>
                )}
            </HydrationBoundary>
        </>
    );
};
export default DetailClassAssignment;
