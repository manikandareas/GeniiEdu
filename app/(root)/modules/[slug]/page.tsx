import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';

import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import ReorderMaterials from './_components/ReorderMaterials';

type DetailModulePageProps = {
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
];

const DetailModulePage: React.FC<DetailModulePageProps> = (props) => {
    return (
        <>
            <HeaderOptions title='Details Module' urls={urls} />
            <main className='grid min-h-screen px-6 xl:grid-cols-4 xl:gap-8'>
                <div className='relative flex-1 space-y-4 xl:col-span-2'>
                    <h1 className='text-xl font-semibold'>
                        Introduction to Web Development
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        {webDevelopmentToC[0].description}
                    </p>
                    <div className='flex items-center gap-4 p-4 text-xs text-primary md:p-0'>
                        <span>
                            <SiGitbook className='inline' size={16} /> 10
                            Learning Materials
                        </span>
                        <span>
                            <SiTask className='inline' size={16} /> 4
                            Assignments
                        </span>
                        <span>
                            <SiGoogleclassroom className='inline' size={16} /> 3
                            Class Used
                        </span>
                    </div>

                    <ReorderMaterials slug={props.params.slug} />
                </div>
                <div className='hidden w-full xl:col-span-2 xl:block'></div>
            </main>
        </>
    );
};
export default DetailModulePage;
