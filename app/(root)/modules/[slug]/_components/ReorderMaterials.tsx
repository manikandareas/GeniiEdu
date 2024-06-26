'use client';
import { Button, buttonVariants } from '@/common/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { webDevelopmentToC } from '@/common/constants/DummyTOC';
import { Reorder } from 'framer-motion';
import { Grip, Plus } from 'lucide-react';
import Link from 'next/link';

import { useState } from 'react';
import { SiGitbook, SiTask } from 'react-icons/si';

type ReorderMaterialsProps = {
    slug: string;
};

const ReorderMaterials: React.FC<ReorderMaterialsProps> = ({ slug }) => {
    const [items, setItems] = useState(webDevelopmentToC[0].subSections);
    return (
        <div className='mt-6 space-y-4'>
            <Reorder.Group axis='y' onReorder={setItems} values={items}>
                {items.map((subSection, idx) => (
                    <Reorder.Item
                        value={subSection}
                        key={subSection.id}
                        // dragControls={dragControls}
                        // dragListener={false}
                    >
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <div>
                                    <CardTitle className='text-lg'>
                                        {subSection.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {subSection.description}
                                    </CardDescription>
                                    <span className='text-xs text-muted-foreground'>
                                        <SiGitbook
                                            className='mr-1.5 inline'
                                            size={16}
                                        />
                                        Learning Materials
                                    </span>
                                </div>

                                <Button size={'icon'} variant={'ghost'}>
                                    <Grip />
                                </Button>
                            </CardHeader>
                        </Card>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='w-full' variant={'outline'}>
                        <Plus className='mr-2 inline' size={16} /> Add More
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className=''>
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/modules/${slug}/learning-materials/editor`}
                            className={buttonVariants({
                                className:
                                    'w-full text-xs hover:cursor-pointer',
                                variant: 'ghost',
                            })}
                        >
                            <SiGitbook className='mr-1.5 inline' size={16} />{' '}
                            Learning Materials
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Button
                            className='w-full text-xs hover:cursor-pointer'
                            variant={'ghost'}
                        >
                            <SiTask className='mr-1.5 inline' size={16} />{' '}
                            Assignments
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
export default ReorderMaterials;
