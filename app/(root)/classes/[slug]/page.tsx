import { getDetailsClass } from '@/actions/classes.actions';
import HeaderOptions from '@/common/components/elements/header-options';
import { Button } from '@/common/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/common/components/ui/popover';
import { Tabs, TabsContent } from '@/common/components/ui/tabs';
import { TABS_TRIGGER_CLASS } from '@/common/constants/details-class-tabs';
import { detailsClassQuery } from '@/common/hooks/details-class';
import { validateRequest } from '@/common/libs/lucia';
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
            <HeaderOptions urls={urls} title={dataClass.data.className} />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <main className='mx-auto w-full max-w-6xl px-2 lg:relative lg:px-0'>
                    <Tabs defaultValue='forum'>
                        <TabsListClass tabs={TABS_TRIGGER_CLASS} />
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
                </main>
            </HydrationBoundary>
        </>
    );
};
export default DetailClassPage;
