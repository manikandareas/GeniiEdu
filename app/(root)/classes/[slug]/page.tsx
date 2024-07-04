import { getDetailedClassBySlug } from '@/actions/classes.actions';
import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { validateRequest } from '@/common/libs/lucia';
import { notFound, redirect } from 'next/navigation';
import DetailClassSection from './_components/DetailClassSection';
import StudentsCards from './_components/StudentsCards';
import TableOfContents from './_components/TableOfContents';
import TeacherCard from './_components/TeacherCard';

type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const { session } = await validateRequest();

    if (!session) return redirect('/login');

    const dataClass = await getDetailedClassBySlug(params.slug).then(
        (response) => {
            if (!response || !response.data) {
                throw new Error('Something went wrong');
            }
            if (!response.data) {
                return notFound();
            }
            return response.data;
        },
    );

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
            name: dataClass.className,
            href: `classes/${params}`,
        },
    ];

    return (
        <>
            <HeaderOptions urls={urls} title={dataClass.className} />
            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <TableOfContents />

                <DetailClassSection initialData={dataClass} />

                <div className='hidden flex-1 space-y-4 xl:block'>
                    <TeacherCard
                        name={dataClass.teacher.name ?? ''}
                        profilePicture={dataClass.teacher.profilePicture ?? ''}
                        username={dataClass.teacher.username ?? ''}
                    />

                    <StudentsCards />
                </div>
            </main>
        </>
    );
};
export default DetailClassPage;
