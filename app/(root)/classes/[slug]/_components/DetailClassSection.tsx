import { GetDetailsClassResponse } from '@/actions/classes.actions';
import { Badge } from '@/common/components/elements/Badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/common/components/ui/accordion';
import { buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { cn, encodeId } from '@/common/libs/utils';
import { Edit3 } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
type DetailClassSectionProps = {
    initialData: GetDetailsClassResponse;
};

const DetailClassSection: React.FC<DetailClassSectionProps> = ({
    initialData,
}) => {
    if (!initialData.success) {
        return null;
    }
    return (
        <div className='relative flex-1 md:col-span-2'>
            <Link
                href={`/classes/${initialData.data.slug}/editor`}
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
                    src={initialData.data.thumbnail?.url ?? ''}
                    width={1600}
                    height={900}
                    alt={initialData.data.thumbnail?.key ?? ''}
                    className='h-[300px] w-full rounded-md object-cover'
                />

                <h1 className='mt-4 text-3xl font-semibold md:text-4xl'>
                    {initialData.data.className}
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
                    {initialData.data.description}
                </p>
            </div>

            {/* Content */}
            <div className='mt-8'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-medium'>Learning Materials</h2>
                </div>

                {initialData.data.learningMaterials &&
                    initialData.data.learningMaterials.length > 0 &&
                    JSON.stringify(initialData.data.learningMaterials)}
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
