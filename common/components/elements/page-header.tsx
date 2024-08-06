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

const PageHeader = ({
    description = 'Dashboard page is a page that shows the current status of the system.',
    actions,
    title,
    urls,
    isShown = true,
}: PageHeader.Props) => {
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

            <div>
                <p className='max-w-[250px] text-right text-xs text-muted-foreground md:text-sm'>
                    {actions ? actions : description}
                </p>
            </div>
        </div>
    );
};
export default PageHeader;

const PageHeaderDescription = ({ description }: { description: string }) => {
    return (
        <p className='max-w-[250px] text-right text-xs text-muted-foreground md:text-sm'>
            {description}
        </p>
    );
};

PageHeader.P = PageHeaderDescription;
