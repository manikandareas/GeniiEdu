'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/common/components/ui/checkbox';
import Image from 'next/image';
import { Input } from '@/common/components/ui/input';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SubmissionsAssignment = {
    id: string;
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        profilePicture: string;
    };
};

export const columns: ColumnDef<SubmissionsAssignment>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label='Select all'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'user',
        header: 'Submitted',
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className='flex items-center space-x-3'>
                    <Image
                        className='size-8 rounded-full'
                        width={32}
                        height={32}
                        src={user.profilePicture}
                        alt={user.name}
                    />
                    <div className='flex flex-col'>
                        <span>{user.name}</span>
                        <span className='text-xs text-muted-foreground'>
                            {user.username}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'grade',
        header: 'Grade',
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className='relative'>
                    <Input className='w-20' maxLength={3} />
                    <span className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                        /100
                    </span>
                </div>
            );
        },
    },
];
