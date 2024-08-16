'use client';
import { removeFiles, saveFilesToDB } from '@/app/_actions/storage-actions';
import {
    createSubmission,
    getSubmission,
    getSubmissionWhereAssIdAndStudentId,
} from '@/app/_actions/submissions-actions';
import { Button } from '@/app/_components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/app/_components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Input } from '@/app/_components/ui/input';
import assignmentsData from '@/app/_data-access/assignments';
import { useUploadThing } from '@/app/_utilities/uploadthing';
import { Loader2, Plus, SendHorizonal, User2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import SelectedFile from '../selected-files';
import { formatDate } from '@/app/_utilities';
import { formatDistance } from 'date-fns';
import PersonalComments from './personal-comments';
import { InferReturnType } from '@/app/_data-access/types';
import { GetDetailsAssignmentResponse } from '@/app/_actions/assignments-actions';
import { useQuery } from '@tanstack/react-query';
import useCurrentUser from '@/app/_hooks/current-user';

type SubmissionAssignmentProps = {
    initialData: GetDetailsAssignmentResponse;
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

    const user = useCurrentUser();

    const bindCreateSubmissionWithArgs = createSubmission.bind(
        null,
        props.initialData.id ?? '',
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

    const { data: submission } = useQuery({
        queryKey: ['submission', props.initialData.id, user?.id],
        queryFn: () =>
            getSubmissionWhereAssIdAndStudentId(
                props.initialData.id,
                user?.id as string,
            ),
    });

    const isLoading =
        isUploading || statusSaveFile === 'executing' || isExecuting;

    const isSubmittedEarlier =
        (submission?.submittedAt || new Date()) <
        (props.initialData?.dueDate as Date);

    const timeDifference = formatDistance(
        submission?.submittedAt || new Date(),
        props.initialData?.dueDate || new Date(),
    );

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Assignment</CardTitle>
                {submission && submission.isGraded ? (
                    <CardDescription className='font-semibold text-green-500'>
                        Graded: {submission.grade}
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
                    {!submission &&
                        submissionFiles.length > 0 &&
                        submissionFiles.map((file) => (
                            <SelectedFile
                                onXClicked={onXClicked}
                                key={file.id}
                                file={file}
                                isStatic={false}
                            />
                        ))}

                    {submission &&
                        submission.files.map((file) => (
                            <SelectedFile
                                onXClicked={onXClicked}
                                key={file.id}
                                file={file}
                                isStatic={true}
                            />
                        ))}
                    {!submission && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    disabled={isUploading || submission}
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
                            !!submission ? (
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
                    {submission && (
                        <span className='text-xs text-muted-foreground'>
                            Submitted at {formatDate(submission.submittedAt)},{' '}
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
    );
};
export default SubmissionAssignment;
