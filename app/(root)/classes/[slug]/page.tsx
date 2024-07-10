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
import MaterialsCard from './_components/materials-card';
import Typography from '@/common/components/ui/typography';
import CreateLMForm from '@/common/components/elements/create-lm-form';
import EmptyStuff from './_components/empty-stuff';
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
            <main className='relative grid min-h-screen px-3 md:grid-cols-3 lg:px-6 xl:grid-cols-4 xl:gap-4'>
                {/* <TableOfContents /> */}

                <AboutClassInformation initialData={dataClass} />

                <div className='flex-1 space-y-4 overflow-hidden lg:relative xl:col-span-2'>
                    {/* <TeacherCard
                        name={dataClass.data.teacher.name ?? ''}
                        profilePicture={
                            dataClass.data.teacher.profilePicture ?? ''
                        }
                        username={dataClass.data.teacher.username ?? ''}
                    />

                    <StudentsCards classSlug={params.slug} /> */}

                    <Tabs defaultValue='learningMaterials'>
                        <div className='flex items-center gap-1.5 lg:sticky lg:top-0'>
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
                        <TabsContent value='learningMaterials' className='py-4'>
                            {/* {dataClass.data.learningMaterials.length === 0 && (
                                <EmptyStuff message='No Learning Materials in this class yet. 😪'>
                                    <CreateLMForm />
                                </EmptyStuff>
                            )} */}

                            <div className='space-y-6'>
                                {Array.from({ length: 20 }).map((_, idx) => {
                                    return (
                                        <MaterialsCard
                                            key={idx}
                                            type='material'
                                        />
                                    );
                                })}
                            </div>
                        </TabsContent>
                        <TabsContent value='assignments'>
                            {dataClass.data.learningMaterials.length === 0 && (
                                <EmptyStuff message='No Assignments in this class yet. 😪'>
                                    <CreateLMForm />
                                </EmptyStuff>
                            )}
                        </TabsContent>
                        <TabsContent value='announcements'>
                            {dataClass.data.learningMaterials.length === 0 && (
                                <EmptyStuff message='No Announcements in this class yet. 😪'>
                                    <CreateLMForm />
                                </EmptyStuff>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </>
    );
};
export default DetailClassPage;
