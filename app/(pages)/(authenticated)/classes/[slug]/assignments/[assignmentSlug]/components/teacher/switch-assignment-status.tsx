'use client';

import { toggleAssignmentStatus } from '@/app/_actions/assignments-actions';
import { Switch } from '@/app/_components/ui/switch';
import Typography from '@/app/_components/ui/typography';
import { Info } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';

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
            <Typography className='hidden md:block' variant={'p'}>
                Menerima kiriman
            </Typography>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Info size={20} className='text-muted-foreground' />
                    </TooltipTrigger>
                    <TooltipContent className='max-w-[18rem]'>
                        <Typography className='text-left' variant={'p'}>
                            Menonaktifkan ini akan mencegah siswa mengirimkan
                            tugas
                        </Typography>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};
export default SwitchAssignmentStatus;
