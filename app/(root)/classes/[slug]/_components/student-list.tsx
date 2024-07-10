'use client';
import Typography from '@/common/components/ui/typography';
import { DUMMY_STUDENTS } from '@/common/constants/dummy-students';
import { prettyText } from '@/common/libs/utils';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useMediaQuery } from 'usehooks-ts';

type StudentListProps = {};

const AMOUNT_OF_STUDENTS = {
    SM: 2,
    LG: 5,
};

const StudentList: React.FC<StudentListProps> = () => {
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    return (
        <div className='flex w-full items-center gap-2'>
            {DUMMY_STUDENTS.slice(
                0,
                isSmallScreen
                    ? AMOUNT_OF_STUDENTS['SM']
                    : AMOUNT_OF_STUDENTS['LG'],
            ).map((student, index) => (
                <div key={index} className='space-y-2 rounded-md'>
                    <Image
                        height={100}
                        width={150}
                        src={student.profilePicture}
                        alt={student.name}
                        className='aspect-video overflow-hidden rounded-md object-cover object-center'
                    />
                    <div className='flex items-center justify-between'>
                        <div>
                            <Typography affects={'small'} variant={'h5'}>
                                {prettyText(student.name, 15)}
                            </Typography>
                            <Typography
                                affects={'muted'}
                                className='text-xs'
                                variant={'h5'}
                            >
                                @{student.username}
                            </Typography>
                        </div>
                        <MoreVertical size={16} />
                    </div>
                </div>
            ))}
        </div>
    );
};
export default StudentList;
