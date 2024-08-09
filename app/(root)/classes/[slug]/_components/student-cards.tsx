'use client';

import { Button } from '@/common/components/ui/button';
import { DUMMY_STUDENTS } from '@/common/constants/dummy-students';
import { MoreVertical } from 'lucide-react';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

type StudentsCardProps = {
    classSlug: string;
};

const StudentsCards: React.FC<StudentsCardProps> = ({ classSlug }) => {
    const dummyStudents = useMemo(() => {
        return DUMMY_STUDENTS.slice(0, 11);
    }, []);
    return (
        <div className='rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
            <div className='flex flex-col space-y-1.5'>
                <h3 className='text-2xl font-semibold leading-none tracking-tight'>
                    Students
                </h3>
                <p className='text-sm text-muted-foreground'>
                    Total students 32
                </p>
            </div>

            <div className='space-y-4 py-6'>
                {dummyStudents.map((item) => (
                    <StudentCartItem key={nanoid()} {...item} />
                ))}
            </div>

            <Link
                className='text-sm text-primary'
                href={`/classes/${classSlug}/students`}
            >
                Show more
            </Link>
        </div>
    );
};
export default StudentsCards;

type StudentCartItemProps = {
    profilePicture: string;
    name: string;
    username: string;
};
export const StudentCartItem: React.FC<StudentCartItemProps> = (props) => {
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <Image
                    className='rounded-full'
                    src={props.profilePicture}
                    width={50}
                    height={50}
                    alt={props.name}
                />

                <div className='space-y-1'>
                    <p className='text-sm'>{props.name}</p>
                    <p className='text-xs text-muted-foreground'>
                        @{props.username}
                    </p>
                </div>
            </div>

            <Button className='rounded-full' size={'icon'} variant={'ghost'}>
                <MoreVertical />
            </Button>
        </div>
    );
};
