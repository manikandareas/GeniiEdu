'use client';
import { ListFilter } from 'lucide-react';

import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/_components/ui/tabs';

import useSearchParamsState from '@/app/_hooks/search-params-state';
import { cn } from '@/app/_utilities';
import { useSearchParams } from 'next/navigation';

import { GetUserClassesResponse } from '@/app/_actions/users-actions';
import { useUserClassesQuery } from '@/app/_hooks/query/user-classes-query';
import { ClassesCard, ClassesCardWrapper } from './classes-card';
import CreateClassForm from './create-class-form';

type TeacherTabsProps = {
    initialData: GetUserClassesResponse;
};

const TeacherTabs: React.FC<TeacherTabsProps> = ({ initialData }) => {
    const searchParams = useSearchParams();

    const { data: classes } = useUserClassesQuery(initialData);

    return (
        <Tabs
            className='w-full'
            value={searchParams.get('tab') ?? 'all'}
            defaultValue='all'
        >
            <div className='flex items-center'>
                <TabsList className='flex-wrap bg-transparent lg:flex-nowrap'>
                    <TeacherTabsTrigger
                        count={classes.data.metadata.total}
                        keyType='all'
                    />
                    <TeacherTabsTrigger
                        count={classes.data.metadata.ongoing}
                        keyType='ongoing'
                    />
                    <TeacherTabsTrigger
                        count={classes.data.metadata.completed}
                        keyType='completed'
                    />
                    <TeacherTabsTrigger
                        count={classes.data.metadata.archived}
                        keyType='archived'
                    />
                </TabsList>
                <div className='ml-auto hidden items-center gap-2 md:flex'>
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
                <ClassesCardWrapper>
                    {classes.data.classes.map((item) => (
                        <ClassesCard
                            key={item.id}
                            description={item.class.description ?? ''}
                            slug={item.class.slug}
                            title={item.class.className}
                            updatedAt={item.class.updatedAt ?? new Date()}
                            thumbnail={item.class.thumbnail[0]?.url ?? ''}
                            statusCompletion={item.statusCompletion}
                        />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>

            <TabsContent value='ongoing'>
                <ClassesCardWrapper>
                    {classes.data.classes.map((item) => (
                        <ClassesCard
                            key={item.id}
                            description={item.class.description ?? ''}
                            slug={item.class.slug}
                            title={item.class.className}
                            updatedAt={item.class.updatedAt ?? new Date()}
                            thumbnail={item.class.thumbnail[0]?.url ?? ''}
                            tab='ongoing'
                            statusCompletion={item.statusCompletion}
                        />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>

            <TabsContent value='completed'>
                <ClassesCardWrapper>
                    {classes.data.classes.map((item) => (
                        <ClassesCard
                            key={item.id}
                            description={item.class.description ?? ''}
                            slug={item.class.slug}
                            title={item.class.className}
                            updatedAt={item.class.updatedAt ?? new Date()}
                            thumbnail={item.class.thumbnail[0]?.url ?? ''}
                            tab='completed'
                            statusCompletion={item.statusCompletion}
                        />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>

            <TabsContent value='archived'>
                <ClassesCardWrapper>
                    {classes.data.classes.map((item) => (
                        <ClassesCard
                            key={item.id}
                            description={item.class.description ?? ''}
                            slug={item.class.slug}
                            title={item.class.className}
                            updatedAt={item.class.updatedAt ?? new Date()}
                            thumbnail={item.class.thumbnail[0]?.url ?? ''}
                            tab='archived'
                            statusCompletion={item.statusCompletion}
                        />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>
        </Tabs>
    );
};
export default TeacherTabs;

type TeacherTabsTriggerProps = {
    keyType: 'all' | 'ongoing' | 'completed' | 'archived';
    disabled?: boolean;
    count: number;
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
                'border-green-600': props.keyType === 'completed',
                'border-zinc-600': props.keyType === 'archived',
                'border-yellow-600': props.keyType === 'ongoing',
                'border-b':
                    props.keyType === 'all' && !active
                        ? true
                        : props.keyType === 'completed' &&
                            active === 'completed'
                          ? true
                          : props.keyType === 'archived' &&
                              active === 'archived'
                            ? true
                            : props.keyType === 'ongoing' &&
                                active === 'ongoing'
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
                            props.keyType === 'completed',
                    },
                    {
                        'bg-yellow-300/10 text-yellow-500':
                            props.keyType === 'ongoing',
                    },
                    {
                        'bg-zinc-300/10 text-zinc-500':
                            props.keyType === 'archived',
                    },
                )}
            >
                {props.count}
            </span>{' '}
            {props.keyType}
        </TabsTrigger>
    );
};
