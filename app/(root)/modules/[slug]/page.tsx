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
    const queryClient = new QueryClient();

    queryClient.prefetchQuery({
        queryKey: ['modules', props.params.slug],
        queryFn: () => getDetailModuleBySlug(props.params.slug),
    });

    return (
        <>
            <HeaderOptions title='Details Module' urls={urls} />

            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <DetailClassSection slug={props.params.slug} />
                    <ClassesUsedList />
                </HydrationBoundary>
            </main>
        </>
    );
};
export default DetailModulePage;
