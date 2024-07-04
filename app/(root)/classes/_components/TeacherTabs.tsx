'use client';
import { File, ListFilter } from 'lucide-react';

import { Button } from '@/common/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';

import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { cn } from '@/common/libs/utils';
import { useSearchParams } from 'next/navigation';

import { GetTeacherClasses, getTeacherClasses } from '@/actions/users.actions';
import { useQuery } from '@tanstack/react-query';
import CreateClassForm from './CreateClassForm';
import TeacherClassCards from './TeacherClassCards';

type TeacherTabsProps = {
    initialData: GetTeacherClasses;
};

const TeacherTabs: React.FC<TeacherTabsProps> = ({ initialData }) => {
    const searchParams = useSearchParams();

    const { data: classes } = useQuery({
        initialData,
        queryKey: ['classes'],
        queryFn: getTeacherClasses,
    });

    return (
        <Tabs value={searchParams.get('tab') ?? 'all'} defaultValue='all'>
            <div className='flex items-center'>
                <TabsList className='bg-transparent'>
                    <TeacherTabsTrigger keyType='all' />
                    <TeacherTabsTrigger keyType='published' />
                    <TeacherTabsTrigger keyType='archived' />
                </TabsList>
                <div className='ml-auto flex items-center gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                className='h-8 gap-1'
                            >
                                <ListFilter className='h-3.5 w-3.5' />
                                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                                    Filter
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                                Active
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Draft
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Archived
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateClassForm />
                </div>
            </div>

            <TabsContent value='all'>
                <TeacherClassCards data={classes.data} />
            </TabsContent>
        </Tabs>
    );
};
export default TeacherTabs;

type TeacherTabsTriggerProps = {
    keyType: 'all' | 'published' | 'archived';
    disabled?: boolean;
};

const TeacherTabsTrigger: React.FC<TeacherTabsTriggerProps> = ({
    disabled = false,
    ...props
}) => {
    const searchParams = useSearchParams();
    const { handleChange } = useSearchParamsState();

    const key = props.keyType === 'all' ? '' : props.keyType;

    const active = searchParams.get('tab');

    return (
        <TabsTrigger
            value={props.keyType}
            disabled={disabled}
            onClick={() => handleChange('tab', key)}
            className={cn('capitalize', {
                'border-blue-600': props.keyType === 'all',
                'border-green-600': props.keyType === 'published',
                'border-yellow-600': props.keyType === 'archived',
                'border-b':
                    props.keyType === 'all' && !active
                        ? true
                        : props.keyType === 'published' &&
                            active === 'published'
                          ? true
                          : props.keyType === 'archived' &&
                              active === 'archived'
                            ? true
                            : false,
            })}
        >
            <span
                className={cn(
                    'mr-2 flex aspect-square w-5 items-center justify-center rounded-full text-xs',
                    { 'bg-blue-300/10 text-blue-500': props.keyType === 'all' },
                    {
                        'bg-green-300/10 text-green-500':
                            props.keyType === 'published',
                    },
                    {
                        'bg-yellow-300/10 text-yellow-500':
                            props.keyType === 'archived',
                    },
                )}
            >
                10
            </span>{' '}
            {props.keyType}
        </TabsTrigger>
    );
};
