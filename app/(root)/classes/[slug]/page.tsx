import { getDetailsClass } from '@/actions/classes.actions';
import HeaderOptions from '@/common/components/elements/header-options';
import { Button } from '@/common/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/common/components/ui/popover';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import { validateRequest } from '@/common/libs/lucia';
import { FolderKanbanIcon, PlusCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiInformatica, SiTask } from 'react-icons/si';
import AboutClassInformation from './_components/about-class-information';
import AnnouncementForm from './_components/announcement-form';
import CreateAssignmentForm from './_components/create-assignment-form';
import CreateLMForm from './_components/create-lm-form';
import EmptyStuff from './_components/empty-stuff';
import MaterialsCard from './_components/materials-card';
import UpcomingTasks from './_components/upcoming-tasks';
type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const dataClass = await getDetailsClass(params.slug).catch((e) =>
        notFound(),
    );

    const { user } = await validateRequest();

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

            <main className='mx-auto w-full max-w-6xl'>
                <div className='space-y-4 overflow-hidden px-2 lg:relative lg:px-0 xl:col-span-2'>
                    <Tabs defaultValue='forum'>
                        <TabsList className='flex overflow-x-scroll'>
                            <TabsTrigger
                                className='flex-1 space-x-2'
                                value='aboutClass'
                            >
                                <SiInformatica
                                    className='text-rose-500'
                                    size={18}
                                />
                                <span className='hidden lg:inline'>
                                    About Class
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                className='flex-1 space-x-2'
                                value='forum'
                            >
                                <FolderKanbanIcon
                                    className='text-green-500'
                                    size={18}
                                />
                                <span className='hidden lg:inline'>Forum</span>
                            </TabsTrigger>
                            <TabsTrigger
                                className='flex-1 space-x-2'
                                value='assignments'
                            >
                                <SiTask className='text-yellow-500' size={18} />{' '}
                                <span className='hidden lg:inline'>
                                    Assignments
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        {/* <Button size={'icon'}>
                                <Plus size={16} />
                            </Button>
                        </div> */}
                        <TabsContent
                            value='aboutClass'
                            className='w-full max-w-6xl'
                        >
                            <AboutClassInformation initialData={dataClass} />
                        </TabsContent>
                        <TabsContent
                            value='forum'
                            className='flex w-full max-w-6xl gap-2'
                        >
                            <UpcomingTasks />

                            <div className='w-full max-w-4xl flex-1 space-y-4 lg:space-y-6'>
                                {user?.role === 'teacher' && (
                                    <AnnouncementForm />
                                )}
                                {dataClass.data.learningMaterials.length ===
                                    0 && (
                                    <EmptyStuff message='No Learning Materials in this class yet. 😪'>
                                        <CreateLMForm />
                                    </EmptyStuff>
                                )}
                                {dataClass.data.learningMaterials.map(
                                    (item, idx) => {
                                        return (
                                            <MaterialsCard
                                                key={idx}
                                                type='material'
                                                teacherName={
                                                    dataClass.data.teacher
                                                        .name ?? ''
                                                }
                                                classSlug={params.slug}
                                                {...item}
                                            />
                                        );
                                    },
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value='assignments'>
                            {user?.role === 'teacher' && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size={'lg'}>
                                            <PlusCircle
                                                size={16}
                                                className='mr-2'
                                            />
                                            Create
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='flex flex-col gap-2'>
                                        <CreateLMForm />
                                        <CreateAssignmentForm />
                                    </PopoverContent>
                                </Popover>
                            )}

                            {dataClass.data.assignments.length === 0 && (
                                <EmptyStuff message='No Assignments in this class yet. 😪'>
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
