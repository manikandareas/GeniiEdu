import { getDetailsModuleMaterial } from '@/actions/classes.actions';
import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { Button, buttonVariants } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import { decodeId } from '@/common/libs/utils';
import { LucideBookOpenText, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MaterialHeader from '../../_components/MaterialHeader';

type DetailsClassMaterialProps = {
    params: {
        materialSlug: string;
        slug: string;
    };
};

const DetailsClassMaterial: React.FC<DetailsClassMaterialProps> = async ({
    params,
}) => {
    const slug = decodeId(params.materialSlug);

    if (!slug) return notFound();

    const initialData = await getDetailsModuleMaterial(slug);

    if (!initialData.success) return notFound();

    const materialFiles = initialData.data.material.files;

    const urls = [
        {
            name: 'Dashboard',
            href: '/dashboard',
        },
        {
            name: 'Classes',
            href: '/classes',
        },
        {
            name: initialData.data.module.moduleName,
            href: `classes/${params.slug}`,
        },
    ];

    return (
        <>
            <HeaderOptions
                title={initialData.data.module.moduleName}
                urls={urls}
            />
            <main className='mx-auto min-h-screen w-full max-w-4xl'>
                <MaterialHeader
                    authorName={initialData.data.material.uploadedBy.name ?? ''}
                    createdAt={initialData.data.material.createdAt!.toDateString()}
                    icon='material'
                    title={initialData.data.material.title}
                />

                <section className='space-y-4 px-4 py-4 md:px-14'>
                    <div
                        // variant={'p'}
                        dangerouslySetInnerHTML={{
                            __html: initialData.data.material.content,
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
                </section>
            </main>
        </>
    );
};
export default DetailsClassMaterial;
