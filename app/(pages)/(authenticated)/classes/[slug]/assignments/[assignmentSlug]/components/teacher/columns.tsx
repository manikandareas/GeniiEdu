'use client';

import { Checkbox } from '@/app/_components/ui/checkbox';
import { InferResultType } from '@/app/_data-access/types';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import InputGrade from './input-grade';

export type SubmissionsAssignment = InferResultType<
    'submissions',
    {
        student: {
            columns: {
                id: true;
                name: true;
                email: true;
                profilePicture: true;
                username: true;
            };
        };
        files: true;
    }
>;

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
            const user = row.original.student;
            return (
                <div className='flex items-center space-x-3'>
                    <Image
                        className='size-8 rounded-full'
                        width={32}
                        height={32}
                        src={user.profilePicture ?? ''}
                        alt={user.name ?? ''}
                    />
                    <div className='flex flex-col'>
                        <span>{user.name}</span>
                        <span className='text-xs text-muted-foreground'>
                            {user.username ?? ''}
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
            const data = row.original;

            return (
                <InputGrade
                    key={data.id}
                    id={data.id}
                    defaultValue={data.grade}
                />
            );
        },
    },
];
