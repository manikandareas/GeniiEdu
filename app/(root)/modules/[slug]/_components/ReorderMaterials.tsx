'use client';
import { GetDetailModuleBySlug } from '@/actions/modules.action';
import { Button } from '@/common/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/common/components/ui/card';
import { Reorder } from 'framer-motion';
import { Grip } from 'lucide-react';

import { useState } from 'react';
import { SiGitbook } from 'react-icons/si';

type ReorderMaterialsProps = {
    data: GetDetailModuleBySlug;
};

const ReorderMaterials: React.FC<ReorderMaterialsProps> = ({ data }) => {
    const [items, setItems] = useState(data?.data!.materials || []);

    return (
        <div className='mt-6 space-y-4'>
            {items.length === 0 ? (
                <p className='py-28 text-center text-muted-foreground'>
                    No Materials.
                </p>
            ) : (
                <Reorder.Group axis='y' onReorder={setItems} values={items}>
                    {items.map((item, idx) => (
                        <Reorder.Item
                            value={item}
                            key={item.id}
                            // dragControls={dragControls}
                            // dragListener={false}
                        >
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between'>
                                    <div>
                                        <CardTitle className='text-lg'>
                                            {item.material.title}
                                        </CardTitle>
                                        {item.material.content && (
                                            <CardDescription
                                                dangerouslySetInnerHTML={{
                                                    __html: item.material
                                                        .content,
                                                }}
                                            />
                                        )}
                                        <span className='text-xs text-muted-foreground'>
                                            <SiGitbook
                                                className='mr-1.5 inline'
                                                size={16}
                                            />
                                            Learning Materials
                                        </span>
                                    </div>

                                    <Button
                                        className=''
                                        size={'icon'}
                                        variant={'ghost'}
                                    >
                                        <Grip />
                                    </Button>
                                </CardHeader>
                            </Card>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
};
export default ReorderMaterials;
