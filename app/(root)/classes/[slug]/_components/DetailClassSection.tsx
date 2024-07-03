import { GetDetailedClassBySlug } from '@/actions/classes.actions';
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
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';
import { cn } from '@/common/libs/utils';
import { Edit3 } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
type DetailClassSectionProps = {
    initialData: GetDetailedClassBySlug;
};

const DetailClassSection: React.FC<DetailClassSectionProps> = ({
    initialData,
}) => {
    if (!initialData) {
        return null;
    }
    return (
        <div className='relative flex-1 md:col-span-2'>
            <Link
                href={`/classes/${initialData.slug}/editor`}
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
                    src={initialData.thumbnail?.url ?? ''}
                    width={1600}
                    height={900}
                    alt={initialData.thumbnail?.key ?? ''}
                    className='h-[300px] w-full rounded-md object-cover'
                />

                <h1 className='mt-4 text-3xl font-semibold md:text-4xl'>
                    {initialData.className}
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
                    {initialData.description}
                </p>
            </div>

            {/* Content */}
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-medium'>Modules</h2>
                </div>

                {initialData.modules.length === 0 && (
                    <p className='text-muted-foreground'>
                        No modules for this class
                    </p>
                )}

                {initialData.modules.length > 0 && (
                    <Accordion
                        type='single'
                        collapsible
                        className='w-full space-y-2'
                    >
                        {initialData.modules.map((item, idx) => (
                            <AccordionItem
                                key={nanoid(5)}
                                value={idx.toString()}
                            >
                                <AccordionTrigger className='text-xl'>
                                    {item.module.moduleName}
                                </AccordionTrigger>
                                <AccordionContent className='flex flex-wrap gap-2'>
                                    {item.module.materials &&
                                        item.module.materials.map((sub) => (
                                            <Card
                                                key={nanoid()}
                                                className='min-w-[50%] flex-1'
                                            >
                                                <CardHeader>
                                                    <CardTitle>
                                                        {sub.material.title}
                                                    </CardTitle>
                                                    <CardDescription
                                                        dangerouslySetInnerHTML={{
                                                            __html: sub.material
                                                                .content!,
                                                        }}
                                                    />
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
                )}
            </div>
        </div>
    );
};
export default DetailClassSection;

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
