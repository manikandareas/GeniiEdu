import { validateRequest } from '@/common/libs/lucia';

import { notFound } from 'next/navigation';
import StudentSection from './components/student/student-section';
import TeacherSection from './components/teacher/teacher-section';
import HeaderOptions from '@/common/components/elements/header-options';
import { decodeUuid } from '@/common/libs/utils';

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
            name: params.slug.replace(/-/g, ' '),
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
            {user.role === 'student' ? <StudentSection /> : <TeacherSection />}
        </>
    );
};
export default DetailClassAssignment;
