import { Flag } from 'lucide-react';

type TooltipTableProps = {};

const TooltipTable: React.FC<TooltipTableProps> = () => {
    return (
        <div className='flex items-center justify-evenly py-1'>
            <div className='flex items-center gap-1.5'>
                <Flag className='fill-green-500 text-green-500' size={16} />
                <span className='text-xs text-muted-foreground'>Saved.</span>
            </div>
            <div className='flex items-center gap-1.5'>
                <Flag className='fill-yellow-500 text-yellow-500' size={16} />
                <span className='text-xs text-muted-foreground'>Draft.</span>
            </div>
            <div className='flex items-center gap-1.5'>
                <Flag className='fill-blue-500 text-blue-500' size={16} />
                <span className='text-xs text-muted-foreground'>
                    Edited (Not saved yet).
                </span>
            </div>
        </div>
    );
};
export default TooltipTable;
