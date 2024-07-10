import { getDetailsClass } from '@/actions/classes.actions';

import { Button } from '@/common/components/ui/button';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { Megaphone, Plus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiGitbook, SiTask } from 'react-icons/si';
import AboutClassContainer from './_components/about-class-container';
import AboutClassInformation from './_components/about-class-information';
import HeaderOptions from '@/common/components/elements/header-options';
type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const dataClass = await getDetailsClass(params.slug).catch((e) =>
        notFound(),
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
            name: dataClass.data.className,
            href: `classes/${params.slug}`,
        },
    ];

    return (
        <>
            <HeaderOptions urls={urls} title={dataClass.data.className} />
            <AboutClassContainer className='relative'>
                {/* <TableOfContents /> */}

                <AboutClassInformation initialData={dataClass} />

                <div className='relative hidden flex-1 space-y-4 xl:col-span-2 xl:block'>
                    {/* <TeacherCard
                        name={dataClass.data.teacher.name ?? ''}
                        profilePicture={
                            dataClass.data.teacher.profilePicture ?? ''
                        }
                        username={dataClass.data.teacher.username ?? ''}
                    />

                    <StudentsCards classSlug={params.slug} /> */}

                    <Tabs defaultValue='learningMaterials'>
                        <div className='sticky top-4 flex items-center gap-1.5'>
                            <TabsList className='w-full'>
                                <TabsTrigger
                                    className='flex-1 space-x-2'
                                    value='learningMaterials'
                                >
                                    <SiGitbook
                                        className='text-green-500'
                                        size={18}
                                    />
                                    <span className=''>Learning Materials</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className='flex-1 space-x-2'
                                    value='assignments'
                                >
                                    <SiTask
                                        className='text-yellow-500'
                                        size={18}
                                    />{' '}
                                    <span>Assignments</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    className='flex-1 space-x-2'
                                    value='announcements'
                                >
                                    <Megaphone
                                        className='text-blue-500'
                                        size={18}
                                    />
                                    <span>Announcements</span>
                                </TabsTrigger>
                            </TabsList>

                            <Button size={'icon'}>
                                <Plus size={16} />
                            </Button>
                        </div>
                        <TabsContent
                            className='h-[200vh]'
                            value='learningMaterials'
                        ></TabsContent>
                        <TabsContent value='assignments'></TabsContent>
                        <TabsContent value='announcements'></TabsContent>
                    </Tabs>
                </div>
            </AboutClassContainer>
        </>
    );
};
export default DetailClassPage;
