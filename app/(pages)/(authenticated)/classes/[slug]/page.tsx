import { getDetailsClass } from '@/app/_actions/classes-actions';
import PageHeader from '@/app/_components/elements/page-header';
import { Button } from '@/app/_components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/app/_components/ui/popover';
import { Tabs, TabsContent } from '@/app/_components/ui/tabs';
import { TABS_TRIGGER_CLASS } from '@/app/_constants/details-class-tabs';
import { detailsClassQuery } from '@/app/_hooks/query/details-class-query';
import { validateRequest } from '@/app/_libs/lucia';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import AboutClassInformation from './_components/about-class-information';
import AnnouncementForm from './_components/announcement-form';
import CreateAssignmentForm from './_components/create-assignment-form';
import CreateLMForm from './_components/create-lm-form';
import EmptyStuff from './_components/empty-stuff';
import MaterialsCard from './_components/materials-card';
import TabsListClass from './_components/tabs-list';
import UpcomingTasks, {
    UpcomingTasksDrawer,
} from './_components/upcoming-tasks';

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

    const { prefetch, queryClient } = detailsClassQuery(params.slug);

    await prefetch();

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
            <PageHeader
                urls={urls}
                title={dataClass.data.className}
                actions={
                    user?.role === 'teacher' ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size={'sm'} variant={'neon'}>
                                    <PlusCircle size={16} className='mr-2' />
                                    Add Assignment
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='flex flex-col gap-2'>
                                <CreateLMForm />
                                <CreateAssignmentForm
                                    classId={dataClass.data.id}
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <UpcomingTasksDrawer classId={dataClass.data.id} />
                    )
                }
            />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <main className='mx-auto w-full px-2 lg:relative lg:px-6'>
                    <Tabs className='lg:space-y-4' defaultValue='forum'>
                        <TabsListClass tabs={TABS_TRIGGER_CLASS} />
                        <TabsContent value='aboutClass' className='w-full'>
                            <AboutClassInformation initialData={dataClass} />
                        </TabsContent>
                        <TabsContent
                            value='forum'
                            className='flex w-full gap-2 lg:gap-4'
                        >
                            <UpcomingTasks classId={dataClass.data.id} />
                            <div className='w-full max-w-4xl flex-1 space-y-2 lg:space-y-4'>
                                {user?.role === 'teacher' && (
                                    <AnnouncementForm />
                                )}
                                {dataClass.data.learningMaterials.length ===
                                    0 && (
                                    <EmptyStuff message='No Learning Materials in this class yet. 😪'>
                                        <CreateLMForm />
                                    </EmptyStuff>
                                )}
                                {[
                                    ...dataClass.data.learningMaterials,
                                    ...dataClass.data.assignments,
                                ]
                                    .sort(
                                        (a, b) =>
                                            new Date(b.createdAt!).getTime() -
                                            new Date(a.createdAt!).getTime(),
                                    )
                                    .map((item, idx) => {
                                        const type = Object.hasOwn(
                                            item,
                                            'content',
                                        )
                                            ? 'material'
                                            : 'assignment';
                                        return (
                                            <MaterialsCard
                                                key={`${item.id}_${idx}`}
                                                type={type}
                                                teacherName={
                                                    dataClass.data.teacher
                                                        .name ?? ''
                                                }
                                                classSlug={params.slug}
                                                {...item}
                                            />
                                        );
                                    })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>
            </HydrationBoundary>
        </>
    );
};
export default DetailClassPage;
