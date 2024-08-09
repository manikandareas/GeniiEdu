import PageHeader from '@/app/_components/elements/page-header';

type EditorClassPageProps = {
    params: {
        slug: string;
    };
};

const EditorClassPage: React.FC<EditorClassPageProps> = ({ params }) => {
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
            name: 'Editor',
            href: `/classes/${params.slug}/editor`,
        },
    ];
    return (
        <>
            <PageHeader title='Editor Page' urls={urls} />
            <div>Editor Class Page</div>
        </>
    );
};
export default EditorClassPage;
