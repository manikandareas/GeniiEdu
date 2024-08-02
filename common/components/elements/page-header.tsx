import GenerateBreadcrumb, { BreadcrumbURLs } from './generate-breadcrumb';

namespace PageHeader {
    export type Props = {
        actions?: React.ReactNode;
        description?: string;
        urls: BreadcrumbURLs;
        title: string;
        isShown?: boolean;
    };
}

const PageHeader: React.FC<PageHeader.Props> = ({
    description,
    actions,
    title,
    urls,
    isShown = true,
}) => {
    if (!isShown) {
        return null;
    }

    return (
        <div className='flex items-center justify-between p-4 sm:px-6 sm:py-0'>
            <div>
                <h1 className='text-xl font-bold text-foreground md:text-2xl'>
                    {title}
                </h1>
                <GenerateBreadcrumb urls={urls} />
            </div>

            {actions ? (
                actions
            ) : (
                <div>
                    <p className='max-w-[250px] text-right text-xs text-muted-foreground md:text-sm'>
                        Dashboard page is a page that shows the current status
                        of the system.
                    </p>
                </div>
            )}
        </div>
    );
};
export default PageHeader;
