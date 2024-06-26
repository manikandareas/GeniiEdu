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
        // <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //         <Button
        //             className='flex w-full items-center justify-center gap-2 border-dashed text-muted-foreground'
        //             variant={'outline'}
        //         >
        //             <Plus />
        //             <span>Attach File</span>
        //         </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align='end' className='w-[16rem]'>
        //         <DropdownMenuItem disabled className='justify-center'>
        //             <SiYoutube className='mr-2 size-4' /> <span>Youtube</span>
        //         </DropdownMenuItem>
        //         <DropdownMenuSeparator />
        //         <DropdownMenuItem asChild>
        //             <UploadDialog />
        //         </DropdownMenuItem>
        //     </DropdownMenuContent>
        // </DropdownMenu>

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
