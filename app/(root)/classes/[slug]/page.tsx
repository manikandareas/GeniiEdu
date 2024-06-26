import { findClassBySlug } from '@/actions/classes.actions';
import { Badge } from '@/common/components/elements/Badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/common/components/ui/accordion';
import { Button, buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';
import { cn } from '@/common/libs/utils';
import { Edit3 } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { SiGmail, SiInstagram, SiWhatsapp } from 'react-icons/si';
import StudentsCards from './_components/StudentsCards';
import TableOfContents from './_components/TableOfContents';
import { validateRequest } from '@/common/libs/lucia';

type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const { session } = await validateRequest();

    if (!session) return redirect('/login');

    const dataClass = await findClassBySlug(params.slug).then((response) => {
        if (!response || !response.data) {
            throw new Error('Something went wrong');
        }
        if (!response.data.success) {
            return notFound();
        }
        return response.data.data;
    });

    return (
        <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
            <TableOfContents />
            <div className='relative flex-1 md:col-span-2'>
                <Link
                    href={`/classes/${dataClass.slug}/editor`}
                    className={cn(
                        buttonVariants({
                            className: 'absolute right-4 top-4',
                            variant: 'outline',
                        }),
                    )}
                >
                    <Edit3 size={16} className='mr-2' /> Edit Class
                </Link>
                {/* Head */}
                <div className='space-y-6'>
                    <Image
                        src={dataClass.thumbnail?.url ?? ''}
                        width={1600}
                        height={900}
                        alt={dataClass.thumbnail?.key ?? ''}
                        className='h-[300px] w-full rounded-md object-cover'
                    />

                    <h1 className='mt-4 text-3xl font-semibold md:text-4xl'>
                        {dataClass.className}
                    </h1>

                    <div className='flex items-center gap-4'>
                        {[
                            {
                                title: 'Module',
                                count: 54,
                            },
                            {
                                title: 'Lessons',
                                count: 194,
                            },
                            {
                                title: 'Exams',
                                count: 13,
                            },
                        ].map((item, index) => (
                            <Comp key={index} {...item} />
                        ))}
                    </div>

                    <p className='text-muted-foreground'>
                        {dataClass.description}
                    </p>
                </div>

                {/* Content */}
                <div className='mt-8'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-2xl font-medium'>Modules</h2>
                        <Button>Add Lesson</Button>
                    </div>

                    <Accordion
                        type='single'
                        collapsible
                        className='w-full space-y-2'
                    >
                        {webDevelopmentToC.map((item, idx) => (
                            <AccordionItem
                                key={nanoid(5)}
                                value={idx.toString()}
                            >
                                <AccordionTrigger className='text-xl'>
                                    {item.title}
                                </AccordionTrigger>
                                <AccordionContent className='flex flex-wrap gap-2'>
                                    {item.subSections &&
                                        item.subSections.map((sub) => (
                                            <Card
                                                key={nanoid()}
                                                className='grow lg:max-w-[49%]'
                                            >
                                                <CardHeader>
                                                    <CardTitle>
                                                        {sub.title}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {sub.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    {/* <Image
                                                        src={
                                                            dataClass.teacher
                                                                .profilePicture!
                                                        }
                                                        width={50}
                                                        height={50}
                                                        alt={
                                                            dataClass.teacher
                                                                .name!
                                                        }
                                                    /> */}
                                                </CardContent>
                                            </Card>
                                        ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            <div className='hidden flex-1 space-y-4 xl:block'>
                <Card className=''>
                    <CardHeader>
                        <CardTitle>Teacher</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-center gap-2'>
                        <Image
                            src={dataClass.teacher.profilePicture!}
                            width={50}
                            height={50}
                            alt={dataClass.teacher.name!}
                            className='rounded-full'
                        />
                        <div className='space-y-1'>
                            <p>{dataClass.teacher.name}</p>
                            <p className='text-xs text-muted-foreground'>
                                @{dataClass.teacher.username}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className='flex items-center gap-4'>
                        <SiGmail size={18} className='text-yellow-400' />
                        <SiInstagram size={18} className='text-pink-400' />
                        <SiWhatsapp size={18} className='text-green-400' />
                    </CardFooter>
                </Card>

                <StudentsCards />
            </div>
        </main>
    );
};
export default DetailClassPage;

type CompProps = {
    count: number;
    title: string;
};
const Comp = (props: CompProps) => {
    return (
        <div className='flex items-center gap-2'>
            <Badge variant={'ongoing'}>{props.count}</Badge>
            <p>{props.title}</p>
        </div>
    );
};
