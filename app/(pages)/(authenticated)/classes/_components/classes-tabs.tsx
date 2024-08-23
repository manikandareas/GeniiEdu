'use client';
import React, { useMemo } from 'react';
import { Button } from '@/app/_components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList } from '@/app/_components/ui/tabs';
import { ListFilter } from 'lucide-react';
import { ClassesCardWrapper, ClassesCard } from './classes-card';
import JoinClassForm from './join-class-form';
import { useSearchParams } from 'next/navigation';
import { useUserClassesQuery } from '@/app/_hooks/query/user-classes-query';
import { GetUserClassesResponse } from '@/app/_actions/users-actions';
import useCurrentRole from '@/app/_hooks/current-role';
import CreateClassForm from './create-class-form';
import CustomTrigger from './custom-trigger';

type ClassesTabsProps = {
    initialData: GetUserClassesResponse;
};

const TABS_KEY = ['all', 'ongoing', 'completed', 'archived'] as const;

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
                    {TABS_KEY.map((keyType) => (
                        <CustomTrigger
                            key={keyType}
                            count={classes.data.metadata[keyType] ?? 0}
                            keyType={
                                keyType as
                                    | 'all'
                                    | 'ongoing'
                                    | 'completed'
                                    | 'archived'
                            }
                        />
                    ))}
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

            {TABS_KEY.map((tab) => (
                <TabsContent key={tab} value={tab}>
                    <ClassesCardWrapper>
                        {formattedData.map((item) => (
                            <ClassesCard
                                key={item.id}
                                tab={tab as any}
                                {...item}
                            />
                        ))}
                    </ClassesCardWrapper>
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default ClassesTabs;
