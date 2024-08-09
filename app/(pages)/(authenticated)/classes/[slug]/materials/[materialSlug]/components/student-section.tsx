import MaterialHeader from '../../../_components/material-header';
import Typography from '@/app/_components/ui/typography';
import Link from 'next/link';
import { buttonVariants } from '@/app/_components/ui/button';
import { GetDetailsClassResponse } from '@/app/_actions/classes-actions';

type StudentSectionProps = {
    initialData: GetDetailsClassResponse;
};

const StudentSection: React.FC<StudentSectionProps> = ({ initialData }) => {
    // if (!initialData) return null;

    // const materialFiles = initialData.material.files;
    return (
        <main className='mx-auto min-h-screen w-full max-w-4xl'>
            {/* <MaterialHeader
                authorName={initialData.material.uploadedBy.name ?? ''}
                createdAt={initialData.material.createdAt!.toDateString()}
                icon='material'
                title={initialData.material.title}
            />

            <section className='space-y-4 px-4 py-4 md:px-14'>
                <div
                    // variant={'p'}
                    dangerouslySetInnerHTML={{
                        __html: initialData.material.content,
                    }}
                ></div>

                {materialFiles &&
                    materialFiles.length > 0 &&
                    materialFiles.map((file) => (
                        <div key={file.file.key}>
                            <iframe
                                key={file.file.key}
                                src={file.file.url}
                                className='aspect-video w-full rounded-md'
                            />
                            <Typography
                                className=''
                                variant={'p'}
                                affects={'muted'}
                            >
                                {file.file.name},
                                <Link
                                    className={buttonVariants({
                                        variant: 'link',
                                        size: 'sm',
                                    })}
                                    href={file.file.url}
                                >
                                    click for details
                                </Link>
                            </Typography>
                        </div>
                    ))}
            </section> */}

            <h1>Student Section</h1>
        </main>
    );
};
export default StudentSection;
