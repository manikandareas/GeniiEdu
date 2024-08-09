import PageHeader from '@/app/_components/elements/page-header';

type ClassesStudentsPageProps = {
    params: {
        slug: string;
    };
};

const ClassesStudentsPage: React.FC<ClassesStudentsPageProps> = ({
    params,
}) => {
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
            name: params.slug,
            href: `/classes/${params.slug}`,
        },
        {
            name: 'Students',
            href: `/classes/${params.slug}/students`,
        },
    ];
    return (
        <>
            <PageHeader urls={urls} title='Classes Students' />
            <main className='container mx-auto'>Classes Students</main>
        </>
    );
};
export default ClassesStudentsPage;
