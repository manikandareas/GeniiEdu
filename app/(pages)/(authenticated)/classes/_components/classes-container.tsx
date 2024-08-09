import { cn } from '@/app/_utilities';
import { ComponentProps } from 'react';

type ClassesContainerProps = ComponentProps<'main'>;

const ClassesContainer: React.FC<ClassesContainerProps> = (props) => {
    const { className, children, ...rest } = props;
    return (
        <main
            {...rest}
            className={cn(
                'flex items-start gap-4 overflow-hidden bg-background p-4 sm:px-6 sm:py-0 md:gap-8',
                className,
            )}
        >
            {children}
        </main>
    );
};
export default ClassesContainer;
