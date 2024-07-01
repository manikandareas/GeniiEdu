import HeaderOptions from '@/common/components/elements/HeaderOptions';

import ClassesUsedList from './_components/ClassesUsedList';
import DetailClassSection from './_components/DetailClassSection';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import { getDetailModuleBySlug } from '@/actions/modules.action';

type DetailModulePageProps = {
    params: {
        slug: string;
    };
};

const DetailModulePage: React.FC<DetailModulePageProps> = async (props) => {
    const queryClient = new QueryClient();

    const initialData = await getDetailModuleBySlug(props.params.slug);

    if (!initialData.success) return null;

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
            name: initialData.data.moduleName,
            href: `/modules/${props.params.slug}`,
        },
    ];

    queryClient.prefetchQuery({
        initialData,
        queryKey: ['modules', props.params.slug],
        queryFn: () => getDetailModuleBySlug(props.params.slug),
    });

    return (
        <>
            <HeaderOptions title='Details Module' urls={urls} />

            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <DetailClassSection
                        initialData={initialData}
                        slug={props.params.slug}
                    />
                    <ClassesUsedList />
                </HydrationBoundary>
            </main>
        </>
    );
};
export default DetailModulePage;
