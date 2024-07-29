import { buttonVariants } from '@/common/components/ui/button';
import Typography from '@/common/components/ui/typography';
import { prettyText } from '@/common/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import PersonalComments from '../student/personal-comments';
import { SubmissionsAssignment } from './Columns';

namespace DetailsSubmission {
    export type Props = {
        data: SubmissionsAssignment;
    };
}

const DetailsSubmission: React.FC<DetailsSubmission.Props> = ({ data }) => {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <Image
                    src={data.student.profilePicture ?? ''}
                    alt={data.student.name ?? ''}
                    width={70}
                    height={70}
                    className='rounded-full'
                />

                <div>
                    <Typography variant={'h4'}>{data.student.name}</Typography>
                    <Typography affects={'muted'}>
                        @{data.student.username}
                    </Typography>
                </div>
            </div>

            <div className='flex gap-2'>
                {data.files.map((file) => (
                    <div title={file.name} className='space-y-2' key={file.key}>
                        <iframe
                            src={file.url}
                            className='aspect-video w-60 rounded-md'
                            allowFullScreen
                        />
                        <div className='flex items-center gap-2'>
                            <p
                                title={file.name}
                                className='text-xs text-muted-foreground'
                            >
                                {prettyText(file.name, 40)}
                            </p>
                            <Link
                                href={file.url}
                                className={buttonVariants({ variant: 'link' })}
                            >
                                Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <PersonalComments
                assignmentId={data.assignmentId}
                studentId={data.studentId}
            />
        </div>
    );
};
export default DetailsSubmission;
