import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { validateRequest } from '@/common/libs/lucia';
import { notFound, redirect } from 'next/navigation';
import DetailClassSection from './_components/DetailClassSection';
import StudentsCards from './_components/StudentsCards';
import TableOfContents from './_components/TableOfContents';
import TeacherCard from './_components/TeacherCard';
import { getDetailsClass } from '@/actions/classes.actions';

type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const { session } = await validateRequest();

    if (!session) return redirect('/login');

    const dataClass = await getDetailsClass(params.slug).then((response) => {
        if (!response || !response.data) {
            return notFound();
        }

        return response;
    });

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
            name: dataClass.data.className,
            href: `classes/${params.slug}`,
        },
    ];

    return (
        <>
            <HeaderOptions urls={urls} title={dataClass.data.className} />
            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <TableOfContents />

                <DetailClassSection initialData={dataClass} />

                <div className='hidden flex-1 space-y-4 xl:block'>
                    <TeacherCard
                        name={dataClass.data.teacher.name ?? ''}
                        profilePicture={
                            dataClass.data.teacher.profilePicture ?? ''
                        }
                        username={dataClass.data.teacher.username ?? ''}
                    />

                    <StudentsCards />
                </div>
            </main>
        </>
    );
};
export default DetailClassPage;
