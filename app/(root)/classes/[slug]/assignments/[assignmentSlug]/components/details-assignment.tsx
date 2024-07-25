import { buttonVariants } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import {
    FindDetailsAssignmentForStudentResponse,
    FindDetailsAssignmentForTeacherResponse,
} from '@/common/data-access/assignments';
import { cn } from '@/common/libs/utils';
import reactParser from 'html-react-parser';
import Link from 'next/link';
import { ComponentProps } from 'react';
import MaterialHeader from '../../../_components/material-header';

type DetailsAssignmentProps = ComponentProps<'main'> & {
    data:
        | FindDetailsAssignmentForStudentResponse
        | FindDetailsAssignmentForTeacherResponse;
};

const DetailsAssignment: React.FC<DetailsAssignmentProps> = ({
    className,
    data,
}) => {
    if (!data) return null;

    const assignmentFiles = data.files ?? [];
    return (
        <main
            className={cn(
                'min-h-[30vh] w-full max-w-4xl border-b md:border-none',
                className,
            )}
        >
            <MaterialHeader
                authorName={data.author.name ?? ''}
                icon='assignment'
                title={data.title}
                createdAt={data.createdAt}
            />

            <section className='space-y-4 px-4 py-4 md:px-14'>
                {reactParser(data.description)}
                {assignmentFiles.map((file) => (
                    <div key={file.key}>
                        <iframe
                            key={file.key}
                            src={file.url}
                            className='aspect-video w-full rounded-md'
                            allowFullScreen
                        />
                        <Typography
                            className=''
                            variant={'p'}
                            affects={'muted'}
                        >
                            {file.name},
                            <Link
                                className={buttonVariants({
                                    variant: 'link',
                                    size: 'sm',
                                })}
                                href={file.url}
                            >
                                click for details
                            </Link>
                        </Typography>
                    </div>
                ))}
            </section>
        </main>
    );
};
export default DetailsAssignment;
