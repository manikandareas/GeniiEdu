import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';

import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import ReorderMaterials from './_components/ReorderMaterials';
import CreateLMForm from './_components/CreateLMForm';
import TableOfContents from '../../classes/[slug]/_components/TableOfContents';
import { Grip, Plus, PlusCircle } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

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
            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <div className='hidden h-full flex-1 py-2 md:block'>
                    <p className='mb-4 text-xl font-semibold'>List Contents</p>
                    {webDevelopmentToC[0].subSections.map((item, index) => (
                        <div
                            key={index}
                            className='flex items-center justify-between rounded-md border border-border bg-background p-2 text-xs'
                        >
                            <div className='flex items-center gap-2'>
                                <SiGitbook size={16} />
                                <p>{item.title}</p>
                            </div>

                            <Grip size={20} />
                        </div>
                    ))}
                </div>

                <div className='relative flex-1 space-y-4 md:col-span-2'>
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

                    <div className='flex w-full items-center gap-2'>
                        <Button variant={'outline'}>
                            <PlusCircle className='mr-2 inline' size={16} />
                            Learning Material
                        </Button>
                        <Button variant={'outline'}>
                            <PlusCircle className='mr-2 inline' size={16} />
                            Assignment
                        </Button>
                    </div>
                    <ReorderMaterials slug={props.params.slug} />
                </div>
                <div className='hidden w-full xl:col-span-2 xl:block'></div>
            </main>
        </>
    );
};
export default DetailModulePage;
