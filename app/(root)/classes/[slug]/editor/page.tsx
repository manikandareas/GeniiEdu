import HeaderOptions from '@/common/components/elements/HeaderOptions';

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
            <HeaderOptions title='Editor' urls={urls} />
            <div>Editor Class Page</div>
        </>
    );
};
export default EditorClassPage;
