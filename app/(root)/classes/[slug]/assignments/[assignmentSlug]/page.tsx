import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Input } from '@/common/components/ui/input';
import Typography from '@/common/components/ui/typography';
import { decodeId } from '@/common/libs/utils';
import {
    MoreVertical,
    Plus,
    SendHorizonal,
    StickyNoteIcon,
    User2,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import MaterialHeader from '../../_components/MaterialHeader';

type DetailClassAssignmentProps = {
    params: {
        assignmentSlug: string;
        slug: string;
    };
};

const DetailClassAssignment: React.FC<DetailClassAssignmentProps> = async ({
    params,
}) => {
    const slug = decodeId(params.assignmentSlug);

    if (!slug) return notFound();

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
            name: 'Assignments',
            href: `classes/${params.slug}`,
        },
    ];

    return (
        <>
            <HeaderOptions title={'Assignment Details'} urls={urls} />
            <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
                <main className='min-h-[30vh] w-full max-w-4xl border-b md:border-none'>
                    <MaterialHeader
                        authorName='Manik'
                        icon='assignment'
                        title='UAS Pemrograman Web'
                        createdAt='23 Apr'
                    />

                    <section className='space-y-4 px-4 py-4 md:px-14'>
                        <Typography variant={'p'}>
                            Uas Pemrograman Web dalam mata kuliah Pemrograman
                            Web
                        </Typography>
                    </section>
                </main>
                <aside className='mx-auto w-full max-w-sm space-y-4 md:mx-0'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle>Assignment</CardTitle>
                            <CardDescription>Submitted</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-4'>
                                <Button className='flex items-center gap-2 border-primary bg-secondary text-primary hover:bg-secondary/90'>
                                    <Plus size={16} />
                                    <span>Add or Create</span>
                                </Button>
                                <Button>Turn in</Button>
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
            </div>
        </>
    );
};
export default DetailClassAssignment;
