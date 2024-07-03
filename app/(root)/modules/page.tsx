import HeaderOptions from '@/common/components/elements/HeaderOptions';
import ModuleTabs from './_components/ModuleTabs';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import { getTeacherModules } from '@/actions/modules.action';

type ModulesPageProps = {};

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Manage Modules',
        href: '/modules',
    },
];

const ModulesPage: React.FC<ModulesPageProps> = async () => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['modules'],
        queryFn: getTeacherModules,
    });

    return (
        <>
            <HeaderOptions title='Manage Modules' urls={urls} />

            <main className='grid flex-1 items-start gap-4 bg-background p-4 sm:px-6 sm:py-0 md:gap-8'>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ModuleTabs />
                </HydrationBoundary>
            </main>
        </>
    );
};

export default ModulesPage;
