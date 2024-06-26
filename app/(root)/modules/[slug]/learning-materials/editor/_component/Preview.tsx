'use client';

import { Separator } from '@/common/components/ui/separator';
import { MoreVertical } from 'lucide-react';
import { SiGitbook } from 'react-icons/si';
import { useLearningMaterialContext } from '../context/learningMaterialContext';
import { useSession } from '@/common/components/providers/SessionProvider';

type PreviewProps = {};

const Preview: React.FC<PreviewProps> = () => {
    const { form } = useLearningMaterialContext();
    const { user } = useSession();
    if (!user) return null;
    return (
        <section className='space-y-4 lg:col-span-2'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <span className='flex size-[40px] items-center justify-center rounded-full bg-primary text-secondary'>
                        <SiGitbook />
                    </span>
                    <div>
                        <h1 className='text-2xl font-medium'>
                            {form.getValues('title')}
                        </h1>
                        <p className='text-xs text-muted-foreground'>
                            {user.name} • {new Date().toDateString()}
                        </p>
                    </div>
                </div>
                <MoreVertical />
            </div>

            <Separator />

            <div className='flex w-fit rounded-lg border border-muted'>
                {/* <Image
                        alt='Thumbnail'
                        width={150}
                        height={75}
                        className='overflow-hidden rounded-bl-lg rounded-tl-lg object-cover'
                        src={
                            'https://utfs.io/f/a6ba8c74-8804-4491-9a59-abb7709eefa8-fnmill.pdf'
                        }
                    /> */}
                <iframe
                    width={150}
                    height={75}
                    className='overflow-hidden rounded-bl-lg rounded-tl-lg object-cover'
                    src={
                        'https://utfs.io/f/a6ba8c74-8804-4491-9a59-abb7709eefa8-fnmill.pdf'
                    }
                />
                <div className='flex flex-col items-start justify-center p-2 text-muted-foreground'>
                    <p className='text-sm uppercase'>Soal uts semester 4</p>
                    <p className='text-xs'>PowerPoint</p>
                </div>
            </div>

            <p
                className='text-sm text-muted-foreground'
                dangerouslySetInnerHTML={{ __html: form.getValues('content') }}
            ></p>
        </section>
    );
};
export default Preview;
