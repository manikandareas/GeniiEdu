'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/common/components/ui/checkbox';
import Image from 'next/image';
import { Input } from '@/common/components/ui/input';
import { cn } from '@/common/libs/utils';
import InputGrade from './input-grade';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SubmissionsAssignment = {
    grade: string | null;
    id: string;
    updatedAt: Date | null;
    assignmentId: string;
    studentId: string;
    isGraded: boolean;
    submittedAt: Date;
    student: {
        id: string;
        name: string | null;
        email: string | null;
        profilePicture: string | null;
        username: string | null;
    };
    files: {
        id: string;
        url: string;
        key: string;
        name: string;
    }[];
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
