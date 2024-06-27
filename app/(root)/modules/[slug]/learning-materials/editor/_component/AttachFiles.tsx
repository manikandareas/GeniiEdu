'use client';
import { Button } from '@/common/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {} from '@uploadthing/react';
import { File, Plus } from 'lucide-react';
import { SiYoutube } from 'react-icons/si';
import UploadDialog from './UploadDialog';

type AttachFilesProps = {};

const AttachFiles: React.FC<AttachFilesProps> = () => {
    return (
        <div className='flex items-center gap-4'>
            <Button
                type='button'
                className='rounded-full'
                size={'icon'}
                variant={'outline'}
            >
                <SiYoutube />
            </Button>
            <UploadDialog />
        </div>
    );
};
export default AttachFiles;
