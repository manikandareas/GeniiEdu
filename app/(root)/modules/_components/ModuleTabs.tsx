'use client';
import { File, ListFilter } from 'lucide-react';

import { Badge } from '@/common/components/elements/Badge';
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
import { webDevelopmentToC } from '@/common/constants/DummyTOC';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { cn } from '@/common/libs/utils';
import { useSearchParams } from 'next/navigation';
import CreateModuleForm from './CreateModuleForm';
import { TeaserModule } from './TeaserModule';
import { useQuery } from '@tanstack/react-query';
import { getTeacherModules } from '@/actions/modules.action';

type ModuleTabsProps = {};

const ModuleTabs: React.FC<ModuleTabsProps> = () => {
    const searchParams = useSearchParams();
    const { handleChange } = useSearchParamsState();

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getTeacherModules,
    });

    return (
        <Tabs value={searchParams.get('tab') ?? 'all'} defaultValue='all'>
            <div className='flex items-center'>
                <TabsList className='bg-transparent'>
                    <ModuleTabsTrigger keyType='all' />
                    <ModuleTabsTrigger keyType='published' />
                    <ModuleTabsTrigger keyType='archived' />
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
                    <Button size='sm' variant='outline' className='h-8 gap-1'>
                        <File className='h-3.5 w-3.5' />
                        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                            Export
                        </span>
                    </Button>
                    <CreateModuleForm />
                </div>
            </div>
            <TeaserModule />

            <TabsContent value='all'>
                <div className='flex flex-wrap gap-4'>
                    {modules?.data &&
                        modules.data.map((item, idx) => (
                            <ModuleItem
                                title={item.moduleName}
                                description={item.description || ''}
                                key={item.id}
                                isPublished={idx % 2 === 0}
                                onClick={() =>
                                    handleChange('active', item.slug)
                                }
                            />
                        ))}
                </div>
            </TabsContent>
        </Tabs>
    );
};
export default ModuleTabs;

type ModuleItemProps = {
    isPublished?: boolean;
    title: string;
    description: string;
    onClick?: () => void;
};
export const ModuleItem: React.FC<ModuleItemProps> = (props) => {
    return (
        <button
            onClick={props.onClick}
            className='w-full rounded-lg border p-4 sm:max-w-sm'
        >
            <div className='flex flex-col items-start space-y-2 transition-all ease-in-out hover:translate-x-1'>
                <Badge variant={props.isPublished ? 'completed' : 'ongoing'}>
                    {props.isPublished ? 'Published' : 'Archived'}
                </Badge>
                <h1>{props.title}</h1>
                <p className='text-start text-sm text-muted-foreground'>
                    {props.description}
                </p>
            </div>
        </button>
    );
};

type ModuleTabsTriggerProps = {
    keyType: 'all' | 'published' | 'archived';
    disabled?: boolean;
};

const ModuleTabsTrigger: React.FC<ModuleTabsTriggerProps> = ({
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
