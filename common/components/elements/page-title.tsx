'use client';
import { useHeaderStore } from '@/common/stores/header-store';
import GenerateBreadcrumb from './generate-breadcrumb';

type PageTitleProps = {};

const PageTitle: React.FC<PageTitleProps> = () => {
    const { title, urls } = useHeaderStore((state) => ({
        title: state.title,
        urls: state.breadcrumbs,
    }));
    return (
        <div className='flex items-center justify-between p-4 sm:px-6 sm:py-0'>
            <div>
                <h1 className='text-2xl font-bold text-foreground'>{title}</h1>
                <GenerateBreadcrumb urls={urls} />
            </div>

            <div>
                {/* Give me description about dashboard page inside tag p bellow */}
                <p className='max-w-[250px] text-right text-sm text-muted-foreground'>
                    Dashboard page is a page that shows the current status of
                    the system.
                </p>
            </div>
        </div>
    );
};
export default PageTitle;
