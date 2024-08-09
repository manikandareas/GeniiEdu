'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/app/_components/ui/accordion';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import { DUMMY_PUBLIC_CLASSES } from '@/app/_constants/dummy-public-classes';
import { DEFAULT_PROFILE } from '@/app/_constants/default-profile';
import { toast } from 'sonner';
type ExploreClassesProps = {};

const ExplorerClasses: React.FC<ExploreClassesProps> = () => {
    const onCopyCodeClicked = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Class code copied to clipboard');
    };
    return (
        <div className='mt-4 md:mt-0'>
            <h1 className='mb-4 text-xl font-semibold'>
                Explore public classes
            </h1>

            <Accordion type='single' collapsible className='w-full'>
                {DUMMY_PUBLIC_CLASSES.map((data) => (
                    <AccordionItem key={nanoid(5)} value={data.token}>
                        <AccordionTrigger>{data.className}</AccordionTrigger>
                        <AccordionContent className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Image
                                        width={35}
                                        height={35}
                                        src={DEFAULT_PROFILE.profilePicture}
                                        alt={data.className}
                                        className='rounded-full'
                                    />
                                    <p>{data.teacherName}</p>
                                </div>
                                <button
                                    onClick={() =>
                                        onCopyCodeClicked(data.token)
                                    }
                                    title='Copy class code'
                                    className='rounded-lg bg-secondary px-3 py-2'
                                >
                                    <code className='font-mono text-xs tracking-widest'>
                                        {data.token}
                                    </code>
                                </button>
                            </div>
                            <p>{data.description}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};
export default ExplorerClasses;
