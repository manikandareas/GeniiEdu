import { validateRequest } from '@/common/libs/lucia';
import { decodeId } from '@/common/libs/utils';
import { notFound } from 'next/navigation';
import StudentSection from './components/student/student-section';
import TeacherSection from './components/teacher/teacher-section';
import HeaderOptions from '@/common/components/elements/header-options';

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

    const slug = decodeId(params.assignmentSlug);

    if (!slug) return notFound();

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
            name: 'Assignments',
            href: `classes/${params.slug}`,
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
