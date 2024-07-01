'use client';

import {
    GetDetailModuleBySlug,
    getDetailModuleBySlug,
} from '@/actions/modules.action';
import { Button } from '@/common/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle } from 'lucide-react';
import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import CreateLMForm from './CreateLMForm';
import ReorderMaterials from './ReorderMaterials';
import TogglePublish from './TogglePublish';

type DetailClassSectionProps = {
    slug: string;
    initialData: GetDetailModuleBySlug;
};

const DetailClassSection: React.FC<DetailClassSectionProps> = ({
    slug,
    initialData,
}) => {
    const moduleQuery = useQuery({
        initialData,
        queryKey: ['modules', slug],
        queryFn: () => getDetailModuleBySlug(slug),
    });

    return (
        <div className='relative flex-1 space-y-4 md:col-span-3'>
            <h1 className='text-xl font-semibold'>
                {moduleQuery.data?.data?.moduleName}
            </h1>
            <p className='text-sm text-muted-foreground'>
                {moduleQuery.data?.data?.description}
            </p>
            <div className='flex items-center gap-4 p-4 text-xs text-primary md:p-0'>
                <span>
                    <SiGitbook className='inline' size={16} />{' '}
                    {moduleQuery.data?.data?.materials.length} Learning
                    Material(s)
                </span>
                <span>
                    <SiTask className='inline' size={16} />{' '}
                    {moduleQuery.data.data?.assignments.length} Assignment(s)
                </span>
                <span>
                    <SiGoogleclassroom className='inline' size={16} /> 3 Class
                    Used
                </span>
            </div>

            <div className='flex w-full items-center justify-between'>
                <TogglePublish
                    defaultChecked={
                        moduleQuery.data?.data?.isPublished ?? false
                    }
                    slug={slug}
                />
                <div className='flex items-center justify-between gap-2'>
                    <CreateLMForm />
                    <Button variant={'gummy'}>
                        <PlusCircle className='mr-2 inline' size={16} />
                        Assignment
                    </Button>
                </div>
            </div>
            <ReorderMaterials data={moduleQuery.data} />
        </div>
    );
};
export default DetailClassSection;
