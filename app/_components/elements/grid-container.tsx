import { cn } from '@/app/_utilities';

type GridContainerProps = React.ComponentProps<'main'>;

const GridContainer: React.FC<GridContainerProps> = (props) => {
    const { className, children, ...rest } = props;
    return (
        <main
            {...rest}
            className={cn(
                'grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-10 lg:grid-cols-3',
                className,
            )}
        >
            {children}
        </main>
    );
};
export default GridContainer;
