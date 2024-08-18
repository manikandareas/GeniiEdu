'use client';
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
import { ListFilter } from 'lucide-react';
import { ClassesCardWrapper, ClassesCard } from './classes-card';
import JoinClassForm from './join-class-form';
import { useSearchParams } from 'next/navigation';
import { useUserClassesQuery } from '@/app/_hooks/query/user-classes-query';
import { useMemo } from 'react';
import { GetUserClassesResponse } from '@/app/_actions/users-actions';
import useSearchParamsState from '@/app/_hooks/search-params-state';
import { cn } from '@/app/_utilities';
import useCurrentUser from '@/app/_hooks/current-user';
import useCurrentRole from '@/app/_hooks/current-role';
import CreateClassForm from './create-class-form';

type ClassesTabsProps = {
    initialData: GetUserClassesResponse;
};

const ClassesTabs: React.FC<ClassesTabsProps> = ({ initialData }) => {
    const searchParams = useSearchParams();

    const { data: classes } = useUserClassesQuery(initialData);

    const authenticatedRole = useCurrentRole();

    const formattedData = useMemo(() => {
        return classes.data.classes.map((item) => ({
            id: item.id,
            description: item.class.description ?? '',
            slug: item.class.slug,
            title: item.class.className,
            updatedAt: item.class.updatedAt ?? new Date(),
            thumbnail: item.class.thumbnail[0]?.url ?? '',
            statusCompletion: item.statusCompletion,
        }));
    }, [classes]);
    return (
        <Tabs
            className='w-full'
            value={searchParams.get('tab') ?? 'all'}
            defaultValue='all'
        >
            <div className='flex items-center'>
                <TabsList className='bg-transparent'>
                    <CustomTrigger
                        count={classes.data.metadata.total}
                        keyType='all'
                    />
                    <CustomTrigger
                        count={classes.data.metadata.ongoing}
                        keyType='ongoing'
                    />
                    <CustomTrigger
                        count={classes.data.metadata.completed}
                        keyType='completed'
                    />
                    <CustomTrigger
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
                    {authenticatedRole === 'teacher' ? (
                        <CreateClassForm />
                    ) : (
                        <JoinClassForm />
                    )}
                </div>
            </div>

            <TabsContent value='all'>
                <ClassesCardWrapper>
                    {formattedData.map((item) => (
                        <ClassesCard key={item.id} {...item} />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>
            <TabsContent value='ongoing'>
                <ClassesCardWrapper>
                    {formattedData.map((item) => (
                        <ClassesCard key={item.id} tab='ongoing' {...item} />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>
            <TabsContent value='completed'>
                <ClassesCardWrapper>
                    {formattedData.map((item) => (
                        <ClassesCard key={item.id} tab='completed' {...item} />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>
            <TabsContent value='archived'>
                <ClassesCardWrapper>
                    {formattedData.map((item) => (
                        <ClassesCard key={item.id} tab='archived' {...item} />
                    ))}
                </ClassesCardWrapper>
            </TabsContent>
        </Tabs>
    );
};
export default ClassesTabs;

type CustomTriggerProps = {
    keyType: 'all' | 'ongoing' | 'completed' | 'archived';
    disabled?: boolean;
    count: number;
};

const CustomTrigger: React.FC<CustomTriggerProps> = ({
    disabled = false,
    ...props
}) => {
    const { handleChange, searchParams } = useSearchParamsState();

    const key = props.keyType === 'all' ? '' : props.keyType;
    const active = searchParams.get('tab');

    const getBorderClass = (keyType: string, active: string | null) => {
        const baseClasses = {
            all: 'border-blue-600',
            completed: 'border-green-600',
            archived: 'border-zinc-600',
            ongoing: 'border-yellow-600',
        };

        const borderBottomClass = {
            all: !active,
            completed: active === 'completed',
            archived: active === 'archived',
            ongoing: active === 'ongoing',
        };

        return `${baseClasses[keyType as keyof typeof baseClasses]} ${borderBottomClass[keyType as keyof typeof borderBottomClass] ? 'border-b' : ''}`;
    };

    const getBackgroundClass = (keyType: string) => {
        const bgClasses = {
            all: 'bg-blue-300/10 text-blue-500',
            completed: 'bg-green-300/10 text-green-500',
            archived: 'bg-zinc-300/10 text-zinc-500',
            ongoing: 'bg-yellow-300/10 text-yellow-500',
        };

        return bgClasses[keyType as keyof typeof bgClasses];
    };

    return (
        <TabsTrigger
            value={props.keyType}
            disabled={disabled}
            data-role={props.keyType}
            onClick={() => handleChange('tab', key)}
            className={cn('capitalize', getBorderClass(props.keyType, active))}
        >
            <span
                className={cn(
                    'mr-2 flex aspect-square w-5 items-center justify-center rounded-full text-xs',
                    getBackgroundClass(props.keyType),
                )}
            >
                {props.count}
            </span>{' '}
            {props.keyType}
        </TabsTrigger>
    );
};
