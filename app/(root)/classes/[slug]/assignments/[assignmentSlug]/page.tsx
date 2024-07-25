import HeaderOptions from '@/common/components/elements/header-options';
import {
    findDetailsAssignment,
    FindDetailsAssignmentForStudentResponse,
    FindDetailsAssignmentForTeacherResponse,
    FindDetailsAssignmentResponse,
} from '@/common/data-access/assignments';
import { validateRequest } from '@/common/libs/lucia';
import { decodeUuid } from '@/common/libs/utils';
import { notFound } from 'next/navigation';
import StudentSection from './components/student/student-section';
import TeacherSection from './components/teacher/teacher-section';
import { InputGradeContextProvider } from './components/teacher/input-grade-context';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { detailsAssignmentQuery } from '@/common/hooks/details-assignment-query';

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
            <HeaderOptions title={'Assignment Details'} urls={urls} />
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
