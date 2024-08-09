'use client';

import { toggleAssignmentStatus } from '@/actions/assignments.actions';
import { Switch } from '@/common/components/ui/switch';
import Typography from '@/common/components/ui/typography';
import { Info } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';

type SwitchAssignmentStatusProps = {
    assignmentId: string;
    isOpen: boolean;
};

const SwitchAssignmentStatus: React.FC<SwitchAssignmentStatusProps> = ({
    assignmentId,
    isOpen,
}) => {
    const { execute, isExecuting } = useAction(toggleAssignmentStatus, {
        onSuccess: ({ data }) => {
            toast.success(data?.message);
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });

    const onToggle = () => {
        execute(assignmentId);
    };

    return (
        <div className='flex items-center gap-2 text-sm'>
            <Switch
                disabled={isExecuting}
                onCheckedChange={onToggle}
                defaultChecked={isOpen}
            />
            <Typography variant={'p'}>Menerima kiriman</Typography>
            <Info className='text-muted-foreground' />
        </div>
    );
};
export default SwitchAssignmentStatus;
