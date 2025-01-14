import { buttonVariants } from '@/app/_components/ui/button';
import Typography from '@/app/_components/ui/typography';

import { getDetailsLearningMaterial } from '@/app/_actions/materials-actions';
import PageHeader from '@/app/_components/elements/page-header';
import { decodeUuid } from '@/app/_utilities';
import reactParser from 'html-react-parser';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MaterialHeader from '../../_components/material-header';

type DetailsClassMaterialProps = {
    params: {
        materialSlug: string;
        slug: string;
    };
};

const DetailsClassMaterial: React.FC<DetailsClassMaterialProps> = async ({
    params,
}) => {
    const materialId = decodeUuid(params.materialSlug);

    if (!materialId) return notFound();

    const initialData = await getDetailsLearningMaterial(materialId)
        .then((res) => {
            if (!res) return notFound();
            return res;
        })
        .catch(notFound);

    const materialFiles = initialData.files ?? [];

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
            name: initialData.class.className ?? '',
            href: `/classes/${initialData.class.slug}`,
        },
        {
            name: initialData.title ?? '',
            href: `/classes/${initialData.class.slug}/${params.materialSlug}`,
        },
    ];

    return (
        <>
            <PageHeader title={'Details Learning Material'} urls={urls} />
            <main className='mx-auto min-h-screen w-full max-w-4xl'>
                <MaterialHeader
                    authorName={initialData.author.name ?? ''}
                    createdAt={initialData.createdAt}
                    icon='material'
                    title={initialData.title ?? ''}
                />

                <section className='space-y-4 px-4 py-4 md:px-14'>
                    <div>{reactParser(initialData.content ?? '')}</div>
                    {materialFiles.map((file) => (
                        <div key={file.key}>
                            <iframe
                                key={file.key}
                                src={file.url}
                                className='aspect-video w-full rounded-md'
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
        </>
    );
};
export default DetailsClassMaterial;
