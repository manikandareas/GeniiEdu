import { buttonVariants } from '@/app/_components/ui/button';
import Typography from '@/app/_components/ui/typography';
import { cn } from '@/app/_utilities';
import reactParser from 'html-react-parser';
import Link from 'next/link';
import { ComponentProps } from 'react';
import MaterialHeader from '../../../_components/material-header';
import { InferReturnType } from '@/app/_data-access/types';
import assignmentsData from '@/app/_data-access/assignments';
import { GetDetailsAssignmentResponse } from '@/app/_actions/assignments-actions';

type DetailsAssignmentProps = ComponentProps<'main'> & {
    initialData: GetDetailsAssignmentResponse;
};

const DetailsAssignment: React.FC<DetailsAssignmentProps> = ({
    className,
    initialData,
}) => {
    if (!initialData) return null;

    const assignmentFiles = initialData.files ?? [];
    return (
        <main
            className={cn(
                'min-h-[30vh] w-full max-w-4xl border-b md:border-none',
                className,
            )}
        >
            <MaterialHeader
                authorName={initialData.author.name ?? ''}
                icon='assignment'
                title={initialData.title}
                createdAt={initialData.createdAt}
            />

            <section className='space-y-4 px-4 py-4 md:px-14'>
                {reactParser(initialData.description)}
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
