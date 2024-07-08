import { cn } from '@/common/libs/utils';
import { ComponentProps } from 'react';

type ClassesContainerProps = ComponentProps<'main'>;

const ClassesContainer: React.FC<ClassesContainerProps> = (props) => {
    const { className, children, ...rest } = props;
    return (
        <main
            {...rest}
            className={cn(
                'grid flex-1 items-start gap-4 bg-background p-4 sm:px-6 sm:py-0 md:gap-8',
                className,
            )}
        >
            {children}
        </main>
    );
};
export default ClassesContainer;
