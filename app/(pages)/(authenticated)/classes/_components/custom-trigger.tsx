import { TabsTrigger } from '@/app/_components/ui/tabs';
import useSearchParamsState from '@/app/_hooks/search-params-state';
import { cn } from '@/app/_utilities';

type CustomTriggerProps = {
    keyType: 'all' | 'ongoing' | 'completed' | 'archived';
    disabled?: boolean;
    count: number;
};

const CustomTrigger: React.FC<CustomTriggerProps> = ({
    disabled = false,
    ...props
}) => {
    const { handleChange, searchParams } = useSearchParamsState();

    const key = props.keyType === 'all' ? '' : props.keyType;
    const active = searchParams.get('tab');

    const getBorderClass = (keyType: string, active: string | null) => {
        const baseClasses = {
            all: 'border-blue-600',
            completed: 'border-green-600',
            archived: 'border-zinc-600',
            ongoing: 'border-yellow-600',
        };

        const borderBottomClass = {
            all: !active,
            completed: active === 'completed',
            archived: active === 'archived',
            ongoing: active === 'ongoing',
        };

        return `${baseClasses[keyType as keyof typeof baseClasses]} ${borderBottomClass[keyType as keyof typeof borderBottomClass] ? 'border-b' : ''}`;
    };

    const getBackgroundClass = (keyType: string) => {
        const bgClasses = {
            all: 'bg-blue-300/10 text-blue-500',
            completed: 'bg-green-300/10 text-green-500',
            archived: 'bg-zinc-300/10 text-zinc-500',
            ongoing: 'bg-yellow-300/10 text-yellow-500',
        };

        return bgClasses[keyType as keyof typeof bgClasses];
    };

    return (
        <TabsTrigger
            value={props.keyType}
            disabled={disabled}
            data-role={props.keyType}
            onClick={() => handleChange('tab', key)}
            className={cn('capitalize', getBorderClass(props.keyType, active))}
        >
            <span
                className={cn(
                    'mr-2 flex aspect-square w-5 items-center justify-center rounded-full text-xs',
                    getBackgroundClass(props.keyType),
                )}
            >
                {props.count}
            </span>{' '}
            {props.keyType}
        </TabsTrigger>
    );
};

export default CustomTrigger;
