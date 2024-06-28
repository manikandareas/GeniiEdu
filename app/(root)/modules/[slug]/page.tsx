import HeaderOptions from '@/common/components/elements/HeaderOptions';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';

import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Label } from '@/common/components/ui/label';
import { Switch } from '@/common/components/ui/switch';
import { DUMMY_CLASSES } from '@/common/constants/DummyClasses';
import {
    ChevronDown,
    Grip,
    MoreHorizontal,
    Plus,
    PlusCircle,
    Save,
} from 'lucide-react';
import Image from 'next/image';
import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import CreateLMForm from './_components/CreateLMForm';
import ReorderMaterials from './_components/ReorderMaterials';
import { Input } from '@/common/components/ui/input';

type DetailModulePageProps = {
    params: {
        slug: string;
    };
};

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Modules',
        href: '/modules',
    },
    {
        name: 'Introduction to Web Development',
        href: '/modules/introduction-to-web-development',
    },
];

const DetailModulePage: React.FC<DetailModulePageProps> = (props) => {
    return (
        <>
            <HeaderOptions title='Details Module' urls={urls} />
            <main className='grid min-h-screen px-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-4'>
                <div className='relative flex-1 space-y-4 md:col-span-3'>
                    <h1 className='text-xl font-semibold'>
                        Introduction to Web Development
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        {webDevelopmentToC[0].description}
                    </p>
                    <div className='flex items-center gap-4 p-4 text-xs text-primary md:p-0'>
                        <span>
                            <SiGitbook className='inline' size={16} /> 10
                            Learning Materials
                        </span>
                        <span>
                            <SiTask className='inline' size={16} /> 4
                            Assignments
                        </span>
                        <span>
                            <SiGoogleclassroom className='inline' size={16} /> 3
                            Class Used
                        </span>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <Switch id='publish' />
                            <Label htmlFor='publish'>Published</Label>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <CreateLMForm />
                            <Button variant={'gummy'}>
                                <PlusCircle className='mr-2 inline' size={16} />
                                Assignment
                            </Button>
                        </div>
                    </div>
                    <ReorderMaterials slug={props.params.slug} />
                </div>
                <div className='hidden w-full xl:block'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-xl font-semibold'>
                                Class(es) Used
                            </CardTitle>
                            <CardDescription>
                                Class(es) that used this module
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-center gap-2'>
                                <Input type='search' placeholder='Search' />
                                <Button size={'sm'}>
                                    Add Class{' '}
                                    <ChevronDown size={18} className='ml-2' />
                                </Button>
                            </div>
                            {DUMMY_CLASSES.map((itm, idx) => (
                                <div
                                    key={idx}
                                    className='flex items-center justify-between rounded-md bg-background py-4 text-sm'
                                >
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={itm.thumbnail}
                                            alt={itm.className}
                                            width={50}
                                            height={50}
                                            className='size-[50px] rounded-full object-cover object-center'
                                        />
                                        <p>{itm.className}</p>
                                    </div>

                                    <MoreHorizontal />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
};
export default DetailModulePage;
