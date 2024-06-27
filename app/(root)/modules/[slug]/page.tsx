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
import { Grip, MoreHorizontal, Plus, PlusCircle, Save } from 'lucide-react';
import Image from 'next/image';
import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import CreateLMForm from './_components/CreateLMForm';
import ReorderMaterials from './_components/ReorderMaterials';

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
                {/* <Card className='hidden space-y-4 border-none md:block'>
                    <div className='flex items-center justify-between'>
                        <CardHeader className='p-0'>
                            <CardTitle className='text-xl font-semibold'>
                                Order Materials
                            </CardTitle>
                            <CardDescription>
                                Drag and drop to reorder materials.
                            </CardDescription>
                        </CardHeader>
                        <Button
                            className='rounded-full py-1 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600'
                            variant={'ghost'}
                            title='Save new order'
                        >
                            <Save className='mr-2 inline' size={16} /> Save
                        </Button>
                    </div>
                    <CardContent className='p-0'>
                        {webDevelopmentToC[0].subSections.map((item, index) => (
                            <div
                                key={index}
                                className='flex items-center justify-between rounded-md border border-border bg-background p-2 text-xs'
                            >
                                <div className='flex items-center gap-2'>
                                    <SiGitbook size={16} />
                                    <p>{item.title}</p>
                                </div>

                                <Grip size={20} />
                            </div>
                        ))}
                    </CardContent>
                </Card> */}

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
                            <Button
                                className='border-rose-500/40 bg-rose-600/10 text-rose-500 hover:bg-rose-600/20 hover:text-rose-600'
                                variant={'outline'}
                            >
                                <PlusCircle className='mr-2 inline' size={16} />
                                Assignment
                            </Button>
                        </div>
                    </div>
                    <ReorderMaterials slug={props.params.slug} />
                </div>
                <div className='hidden w-full xl:block'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div>
                                <CardTitle className='text-xl font-semibold'>
                                    Class(es) Used
                                </CardTitle>
                                <CardDescription>
                                    Class(es) that used this module
                                </CardDescription>
                            </div>
                            <Button>
                                <Plus size={16} /> Add to class
                            </Button>
                        </CardHeader>
                        <CardContent>
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
