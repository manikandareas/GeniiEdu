'use client';

import { Button } from '@/common/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/common/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/common/components/ui/drawer';
import { ScrollArea } from '@/common/components/ui/scroll-area';

import {
    type GetDetailModuleBySlug,
    getDetailModuleBySlug,
} from '@/actions/modules.action';
import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SiGitbook, SiGoogleclassroom, SiTask } from 'react-icons/si';
import { useMediaQuery } from 'usehooks-ts';

export function TeaserModule() {
    const searchParams = useSearchParams();
    const { handleChange } = useSearchParamsState();

    const active = !!searchParams.get('active');

    const isDesktop = useMediaQuery('(min-width: 768px)');

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            handleChange('active', '');
        }
    };

    const { data: module } = useQuery({
        queryKey: ['modules', searchParams.get('active')],
        queryFn: () =>
            getDetailModuleBySlug(searchParams.get('active') as string),
    });

    if (!module?.success) {
        return null;
    }

    if (isDesktop) {
        return (
            <Dialog open={active} onOpenChange={handleOpenChange}>
                <DialogContent className='sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>{module?.data.moduleName}</DialogTitle>
                        <DialogDescription>
                            {module?.data.description}
                        </DialogDescription>
                    </DialogHeader>
                    <Teaser module={module.data} />

                    <DialogFooter>
                        <Button variant={'outline'} asChild>
                            <Link href={`/modules/${module?.data.slug}`}>
                                View Detail
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={active} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader className='text-left'>
                    <DrawerTitle>{module?.data.moduleName}</DrawerTitle>
                    <DrawerDescription>
                        {module?.data.description}
                    </DrawerDescription>
                </DrawerHeader>

                <Teaser module={module.data} />
                <DrawerFooter className='pt-2'>
                    <DrawerClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DrawerClose>
                    <Button variant={'outline'} asChild>
                        <Link href={`/modules/${module?.data.slug}`}>
                            View Detail
                        </Link>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

type TeaserProps = {
    module: GetDetailModuleBySlug;
};
function Teaser({ module }: TeaserProps) {
    if (!module) {
        return null;
    }

    return (
        <div>
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

            <ScrollArea className='mt-2 h-48 p-4 md:p-0'>
                {module.materials.length === 0 ? (
                    <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
                        No Learning Materials and Assignments exists 🫥
                    </div>
                ) : (
                    <div className='space-y-4 md:mt-4'>
                        {module.materials.map((itm, idx) => (
                            <div
                                key={idx}
                                className='flex items-center gap-x-2 rounded-md border p-2'
                            >
                                {idx > 2 ? (
                                    <SiTask className='inline' size={16} />
                                ) : (
                                    <SiGoogleclassroom
                                        className='inline'
                                        size={16}
                                    />
                                )}{' '}
                                <h2 className='text-sm'>
                                    {itm.material.title}
                                </h2>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
