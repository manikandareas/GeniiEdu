import { GetUserClassesFilter } from '@/actions/users.actions';
import { buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Typography from '@/common/components/ui/typography';
import { cn, prettyText } from '@/common/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

type ClassesCardWrapperProps = ComponentProps<'section'>;
export const ClassesCardWrapper: React.FC<ClassesCardWrapperProps> = (
    props,
) => {
    const { className, children, ...rest } = props;
    return (
        <section {...rest} className={cn('flex flex-wrap gap-3', className)}>
            {children}
        </section>
    );
};

type ClassesCardProps = {
    slug: string;
    title: string;
    thumbnail: string;
    updatedAt: Date;
    description: string;
    statusCompletion: GetUserClassesFilter;
    tab?: 'ongoing' | 'completed' | 'archived';
};
export const ClassesCard: React.FC<ClassesCardProps> = ({
    slug,
    title,
    thumbnail,
    description,
    statusCompletion,
    tab,
}) => {
    if (tab && statusCompletion) {
        if (tab !== statusCompletion) return null;
    }

    return (
        <Card className='group/card mx-auto w-full max-w-[95%] md:max-w-[calc((100%/2)-(3px*2))] lg:mx-0 lg:max-w-[calc((100%/3)-(3px*3))]'>
            <CardHeader className='space-y-3'>
                <div className='relative aspect-video h-36 overflow-clip rounded-md'>
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className='rounded-md object-cover object-center'
                    />
                </div>

                <CardTitle className='transition-transform ease-in-out group-hover/card:translate-x-1'>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className='transition-transform ease-in-out group-hover/card:translate-x-1'>
                <Typography className='max-w-xs'>
                    {prettyText(description)}
                </Typography>
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <span className='text-xs text-muted-foreground'>
                    Active 56 minute(s) ago
                </span>

                <Link
                    href={`/classes/${slug}`}
                    className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                    })}
                >
                    View Details
                </Link>
            </CardFooter>
        </Card>
    );
};
