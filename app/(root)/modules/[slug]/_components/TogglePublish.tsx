'use client';
import { togglePublishedModule } from '@/actions/modules.action';
import { Label } from '@/common/components/ui/label';
import { Switch } from '@/common/components/ui/switch';
import { QueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';

type TogglePublishProps = {
    defaultChecked: boolean;
    slug: string;
};

const TogglePublish: React.FC<TogglePublishProps> = ({
    defaultChecked,
    slug,
}) => {
    const queryClient = new QueryClient();

    const { execute: executeTogglePublished, status: statusTogglePublished } =
        useAction(togglePublishedModule, {
            onSuccess: ({ data }) => {
                if (!data) throw new Error('Something went wrong');

                if (!data.success) {
                    toast.error(data.error);
                    return;
                }

                toast.success(data.message);
                queryClient.invalidateQueries({ queryKey: ['modules', slug] });
            },
        });

    const onTogglePublishedClicked = () => {
        executeTogglePublished(slug);
    };
    return (
        <div className='flex items-center space-x-2'>
            <Switch
                id='publish'
                onCheckedChange={onTogglePublishedClicked}
                disabled={statusTogglePublished === 'executing'}
                defaultChecked={defaultChecked}
            />
            <Label htmlFor='publish'>Published</Label>
        </div>
    );
};
export default TogglePublish;
