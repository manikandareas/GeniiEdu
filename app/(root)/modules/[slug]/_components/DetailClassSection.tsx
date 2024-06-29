'use client';

import { webDevelopmentToC } from '@/common/constants/DummyTOC';

import { Button } from '@/common/components/ui/button';
import { Label } from '@/common/components/ui/label';
import { Switch } from '@/common/components/ui/switch';
import { PlusCircle } from 'lucide-react';
import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import CreateLMForm from './CreateLMForm';
import ReorderMaterials from './ReorderMaterials';
import { useQuery } from '@tanstack/react-query';
import { getDetailModuleBySlug } from '@/actions/modules.action';

type DetailClassSectionProps = {
    slug: string;
};

const DetailClassSection: React.FC<DetailClassSectionProps> = ({ slug }) => {
    const moduleQuery = useQuery({
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
                    <SiGitbook className='inline' size={16} /> 10 Learning
                    Materials
                </span>
                <span>
                    <SiTask className='inline' size={16} /> 4 Assignments
                </span>
                <span>
                    <SiGoogleclassroom className='inline' size={16} /> 3 Class
                    Used
                </span>
            </div>

            <div className='flex w-full items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <Switch
                        id='publish'
                        defaultChecked={moduleQuery.data?.data?.isPublished}
                        // checked={moduleQuery.data?.data?.isPublished}
                    />
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
            <ReorderMaterials slug={slug} />
        </div>
    );
};
export default DetailClassSection;
