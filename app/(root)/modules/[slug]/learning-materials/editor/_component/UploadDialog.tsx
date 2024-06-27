'use client';
import { saveFilesToDB } from '@/actions/storage.actions';
import { UploadDropzone } from '@/common/components/elements/Uploadthing';

import { Button, buttonVariants } from '@/common/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/common/components/ui/dialog';
import { File } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useLearningMaterialContext } from '../context/learningMaterialContext';
import { LM_FILE_TYPE } from '@/common/constants/LMFileType';

type UploadDialogProps = {};

const UploadDialog: React.FC<UploadDialogProps> = () => {
    // Idea is upload to uploadthing -> save to files(database) -> returning their ids
    const { form } = useLearningMaterialContext();

    const { executeAsync, status } = useAction(saveFilesToDB, {
        onSuccess: ({ data }) => {
            if (!data) throw new Error('Something went wrong');

            if (!data.success) {
                toast.error(data.error);
                return;
            }

            toast.success(data.message);
            console.log(JSON.stringify(data, null, 2));

            const prevFiles = form.getValues('files')!;
            form.setValue(
                'files',
                prevFiles.concat(
                    data.data.map((f) => ({
                        key: f.key!,
                        id: f.id,
                        type: f.type,
                        url: f.url,
                    })),
                ),
            );
        },
    });

    const onClientUploadSuccess = async (
        data: {
            url: string;
            key: string;
            type: 'image' | 'video' | 'pdf' | 'youtube';
        }[],
    ) => {
        // do save to database file
        await executeAsync(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className='rounded-full'
                    size={'icon'}
                    variant={'outline'}
                >
                    <File size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Choose or drag and drop a file
                    </DialogDescription>
                </DialogHeader>

                <UploadDropzone
                    onClientUploadComplete={async (res) => {
                        await onClientUploadSuccess(
                            res.map((r) => ({
                                key: r.key,
                                url: r.url,
                                type: LM_FILE_TYPE[
                                    r.type as keyof typeof LM_FILE_TYPE
                                ] as any,
                            })),
                        );
                    }}
                    endpoint='learningMaterialsFileUploader'
                    appearance={{
                        button: buttonVariants({
                            variant: 'outline',
                            className: 'z-20',
                        }),
                        label: 'text-primary hover:text-primary/80',
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};
export default UploadDialog;
