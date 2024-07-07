import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import DetailsAssignment from '../DetailsAssignment';
import { Button } from '@/common/components/ui/button';
import { Info, Mail, Settings } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/common/components/ui/select';
import SubmissionsTable, { DUMMY_STUDENTS } from './SubmissionsTable';
import Typography from '@/common/components/ui/typography';
import { Switch } from '@/common/components/ui/switch';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import Image from 'next/image';

type TeacherSectionProps = {};

const TeacherSection: React.FC<TeacherSectionProps> = () => {
    return (
        <main className='w-full px-4 py-4 md:px-6 md:py-0'>
            <Tabs defaultValue='studentAssignment' className=''>
                <TabsList className='mb-2'>
                    <TabsTrigger value='details'>Details</TabsTrigger>
                    <TabsTrigger value='studentAssignment'>
                        Student Assignment
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='details'>
                    <DetailsAssignment className='mx-auto' />
                </TabsContent>
                <TabsContent value='studentAssignment'>
                    <main className='space-y-4'>
                        {/* Action bar */}
                        <div className='flex h-16 items-center justify-between'>
                            <div className='flex items-center gap-x-4'>
                                <Button>Return</Button>
                                <Button variant={'ghost'} size={'icon'}>
                                    <Mail size={24} />
                                </Button>
                            </div>

                            <div className='flex items-center gap-x-4'>
                                <Select defaultValue='100'>
                                    <SelectTrigger className='w-[180px]'>
                                        <SelectValue
                                            defaultValue={'100'}
                                            placeholder='100'
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='100'>100</SelectItem>
                                        <SelectItem value='tidak-dinilai'>
                                            Tidak dinilai
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant={'ghost'} size={'icon'}>
                                    <Settings size={24} />
                                </Button>
                            </div>
                        </div>

                        <section className='flex'>
                            <div className='h-screen w-full lg:max-w-sm'>
                                <SubmissionsTable />
                            </div>
                            <div className='hidden h-screen w-full lg:block'>
                                <div className='space-y-2 p-4'>
                                    <Typography variant={'h4'}>
                                        Assignment Title
                                    </Typography>

                                    <div className='flex justify-between'>
                                        <div className='flex w-32 divide-x'>
                                            <div className='p-4'>
                                                <Typography variant={'h2'}>
                                                    19
                                                </Typography>
                                                <p className='text-xs text-muted-foreground'>
                                                    Diserahkan
                                                </p>
                                            </div>
                                            <div className='p-4'>
                                                <Typography variant={'h2'}>
                                                    0
                                                </Typography>
                                                <p className='text-xs text-muted-foreground'>
                                                    Ditugaskan
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Switch checked />
                                                <Typography variant={'p'}>
                                                    Menerima kiriman
                                                </Typography>
                                                <Info className='text-muted-foreground' />
                                            </div>

                                            <div className='pt-2'>
                                                <Select defaultValue='100'>
                                                    <SelectTrigger className='w-[180px] border-transparent'>
                                                        <SelectValue
                                                            defaultValue={'100'}
                                                            placeholder='100'
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value='100'>
                                                            Semua
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Diserahkan
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Ditugaskan
                                                        </SelectItem>
                                                        <SelectItem value='tidak-dinilai'>
                                                            Dinilai
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className='grid grid-cols-4'></div> */}
                                    <OverviewSubmissionCards />
                                </div>
                            </div>
                        </section>
                    </main>
                </TabsContent>
            </Tabs>
        </main>
    );
};
export default TeacherSection;

type OverviewSubmissionCardProps = {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string;
};
const OverviewSubmissionCard: React.FC<OverviewSubmissionCardProps> = ({
    email,
    id,
    name,
    profilePicture,
    username,
}) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
                <Image
                    width={32}
                    height={32}
                    src={profilePicture}
                    alt={name}
                    className='rounded-full'
                />
                <Typography>{name}</Typography>
            </CardHeader>
            <CardContent className='space-y-2'>
                <Image
                    src={'https://picsum.photos/200/300'}
                    width={200}
                    height={200}
                    className='aspect-video h-24 object-cover'
                    alt='file name'
                />

                <Typography affects={'muted'}>Submission file name</Typography>
            </CardContent>
            <CardFooter>
                <Typography className='text-sm text-primary'>
                    Diserahkan
                </Typography>
            </CardFooter>
        </Card>
    );
};

const OverviewSubmissionCards = () => {
    return (
        <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
            {DUMMY_STUDENTS.map((item) => (
                <OverviewSubmissionCard key={item.id} {...item.user} />
            ))}
        </div>
    );
};
