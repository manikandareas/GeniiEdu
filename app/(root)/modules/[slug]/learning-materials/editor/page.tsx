import HeaderOptions from '@/common/components/elements/HeaderOptions';
import LearningMaterialForm from './_component/LearningMaterialForm';
import Preview from './_component/Preview';
import LearningMaterialProvider from './context/learningMaterialContext';

type EditorLearningMaterialsPageProps = {
    params: {
        slug: string;
    };
};

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Modules',
        href: '/modules',
    },
    {
        name: 'Introduction to Web Development',
        href: '/modules/introduction-to-web-development',
    },
    {
        name: 'Learning Materials',
        href: '/modules/introduction-to-web-development/learning-materials',
    },
    {
        name: 'Editor',
        href: '/modules/introduction-to-web-development/learning-materials/editor',
    },
];

const EditorLearningMaterialsPage: React.FC<
    EditorLearningMaterialsPageProps
> = ({ params }) => {
    return (
        <>
            <HeaderOptions title='Editor' urls={urls} />
            <main className='mx-auto w-full max-w-7xl'>
                <LearningMaterialProvider>
                    <LearningMaterialForm moduleSlug={params.slug} />
                    {/* <Preview /> */}
                </LearningMaterialProvider>
            </main>
        </>
    );
};
export default EditorLearningMaterialsPage;
