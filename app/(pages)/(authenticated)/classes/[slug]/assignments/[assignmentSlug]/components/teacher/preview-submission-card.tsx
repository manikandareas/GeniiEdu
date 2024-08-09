'use client';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/app/_components/ui/card';
import Typography from '@/app/_components/ui/typography';
import { prettyText } from '@/app/_utilities';
import Image from 'next/image';
import { SubmissionsAssignment } from './Columns';

namespace PreviewSubmissionCards {
    export type Props = SubmissionsAssignment;
}
const PreviewSubmissionCard: React.FC<PreviewSubmissionCards.Props> = (
    props,
) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center gap-2'>
                <Image
                    width={32}
                    height={32}
                    src={props.student.profilePicture ?? ''}
                    alt={props.student.name ?? ''}
                    className='rounded-full'
                />
                <Typography>{props.student.name}</Typography>
            </CardHeader>
            <CardContent className='space-y-2'>
                <iframe
                    src={props.files[0].url}
                    width={200}
                    height={200}
                    className='aspect-video max-h-24 w-full object-cover'
                    // alt='file name'
                />

                <Typography affects={'muted'}>
                    {prettyText(props.files[0].name, 35)}
                </Typography>
            </CardContent>
            <CardFooter>
                <Typography className='text-sm text-primary'>
                    Diserahkan
                </Typography>
            </CardFooter>
        </Card>
    );
};
export default PreviewSubmissionCard;
