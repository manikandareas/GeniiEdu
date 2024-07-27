'use client';
import { removeFiles, saveFilesToDB } from '@/actions/storage.actions';
import { createSubmission } from '@/actions/submissions.actions';
import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { Input } from '@/common/components/ui/input';
import { FindDetailsAssignmentForStudentResponse } from '@/common/data-access/assignments';
import { useUploadThing } from '@/common/utils/uploadthing';
import { Loader2, Plus, SendHorizonal, User2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import SelectedFile from '../selected-files';
import { formatDate } from '@/common/libs/utils';
import { formatDistance } from 'date-fns';

type SubmissionAssignmentProps = {
    data: FindDetailsAssignmentForStudentResponse;
};

const SubmissionAssignment: React.FC<SubmissionAssignmentProps> = (props) => {
    const [submissionFiles, setSubmissionFiles] = useState<
        {
            key: string;
            name: string;
            url: string;
            type: 'image' | 'video' | 'pdf' | 'youtube';
            id: string;
        }[]
    >([]);

    const bindCreateSubmissionWithArgs = createSubmission.bind(
        null,
        props.data?.id ?? '',
    );
    const { executeAsync: executeCreateSubmissions, isExecuting } = useAction(
        bindCreateSubmissionWithArgs,
        {
            onSuccess: ({ data }) => {
                if (!data) return;
                toast.success(data.message);
            },
        },
    );

    const { isUploading, startUpload } = useUploadThing(
        'learningMaterialsFileUploader',
        {
            onClientUploadComplete: (file) => {
                executeSaveFile(
                    file.map((f) => ({
                        key: f.key,
                        name: f.name,
                        type: f.type.includes('image') ? 'image' : 'pdf',
                        url: f.url,
                    })),
                );
            },
        },
    );

    const { executeAsync: executeSaveFile, status: statusSaveFile } = useAction(
        saveFilesToDB,
        {
            onSuccess: ({ data }) => {
                if (!data) return;
                toast.success(data?.message);

                setSubmissionFiles((prev) =>
                    prev.concat(
                        data.data.map((f) => ({
                            key: f.key!,
                            id: f.id,
                            type: f.type,
                            url: f.url,
                            name: f.name!,
                        })),
                    ),
                );
            },
            onError: ({ error }) => {
                toast.error(error.serverError);
                // toast.error(error);
            },
        },
    );

    const onXClicked = async (key: string) => {
        setSubmissionFiles((prev) => prev.filter((f) => f.key !== key));
        await removeFiles([key]);
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const arrayFiles = Array.from(files);

        const response = await startUpload(arrayFiles);

        if (!response) return;
    };

    const userSubmission = props.data?.submissions[0];

    const isLoading =
        isUploading || statusSaveFile === 'executing' || isExecuting;

    const isSubmittedEarlier =
        (props.data?.submissions[0].submittedAt || new Date()) <
        (props.data?.dueDate || new Date());

    const timeDifference = formatDistance(
        props.data?.submissions[0].submittedAt || new Date(),
        props.data?.dueDate || new Date(),
    );

    return (
        <aside className='mx-auto w-full max-w-sm space-y-4 md:mx-0'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle>Assignment</CardTitle>
                    {props.data?.submissions &&
                    props.data.submissions.length > 0 &&
                    props.data.submissions[0].isGraded ? (
                        <CardDescription className='font-semibold text-green-500'>
                            Graded: {props.data.submissions[0].grade}
                        </CardDescription>
                    ) : (
                        <CardDescription>Submitted</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <input
                        type='file'
                        id='fileUploader'
                        hidden
                        onChange={handleChange}
                        accept='image/*,  .pdf, .doc, .docx'
                    />
                    <div className='flex flex-col gap-4'>
                        {!userSubmission &&
                            submissionFiles.length > 0 &&
                            submissionFiles.map((file) => (
                                <SelectedFile
                                    onXClicked={onXClicked}
                                    key={file.id}
                                    file={file}
                                    isStatic={false}
                                />
                            ))}

                        {userSubmission &&
                            userSubmission.files.map((file) => (
                                <SelectedFile
                                    onXClicked={onXClicked}
                                    key={file.id}
                                    file={file}
                                    isStatic={true}
                                />
                            ))}
                        {!!!userSubmission && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        disabled={
                                            isUploading || !!userSubmission
                                        }
                                        className='flex items-center gap-2 bg-secondary text-primary hover:bg-secondary/80'
                                    >
                                        <Plus size={16} />
                                        <span>Add or Create</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-80'>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            document
                                                ?.getElementById('fileUploader')
                                                ?.click()
                                        }
                                    >
                                        Attach Files
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        Create new Word
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        Add Youtube source
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <Button
                            onClick={() =>
                                executeCreateSubmissions({
                                    files: submissionFiles,
                                })
                            }
                            disabled={isLoading}
                        >
                            {!isExecuting ? (
                                !!userSubmission ? (
                                    'Cancel Submission'
                                ) : (
                                    'Turn in'
                                )
                            ) : (
                                <p className='animate-pulse'>
                                    <Loader2
                                        className='mr-1 inline animate-spin'
                                        size={18}
                                    />{' '}
                                    Turn in
                                </p>
                            )}
                        </Button>
                        {props.data?.submissions[0].submittedAt && (
                            <span className='text-xs text-muted-foreground'>
                                Submitted at{' '}
                                {formatDate(
                                    props.data?.submissions[0].submittedAt,
                                )}
                                ,{' '}
                                {isSubmittedEarlier ? (
                                    <span className='text-primary'>
                                        {timeDifference} earlier
                                    </span>
                                ) : (
                                    <span className='text-destructive'>
                                        {timeDifference} late
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className=''>
                    <CardTitle className='flex items-center gap-2 text-xl'>
                        <User2 size={20} />
                        <span>Personal Comments</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex items-center gap-2'>
                    <Input placeholder='Add a comment for your teacher...' />
                    <Button variant={'ghost'} size={'icon'}>
                        <SendHorizonal size={16} />
                    </Button>
                </CardContent>
            </Card>
        </aside>
    );
};
export default SubmissionAssignment;
