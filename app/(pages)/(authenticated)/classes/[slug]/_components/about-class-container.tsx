import { cn } from '@/app/_utilities';
import { ComponentProps } from 'react';

type AboutClassContainerProps = ComponentProps<'main'>;

const AboutClassContainer: React.FC<AboutClassContainerProps> = (props) => {
    const { className, children, ...rest } = props;
    return (
        <main
            {...rest}
            className={cn(
                'grid min-h-screen px-3 md:grid-cols-3 lg:px-6 xl:grid-cols-4 xl:gap-4',
                className,
            )}
        >
            {children}
        </main>
    );
};
export default AboutClassContainer;
