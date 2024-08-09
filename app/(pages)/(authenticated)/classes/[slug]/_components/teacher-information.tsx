'use client';
import Typography from '@/app/_components/ui/typography';
import { prettyText } from '@/app/_utilities';
import Image from 'next/image';
import { SiGmail, SiInstagram, SiWhatsapp } from 'react-icons/si';
import { useMediaQuery } from 'usehooks-ts';

type TeacherInformationProps = {
    profilePicture: string;
    name: string;
    username: string;
    bio: string;
};

const TeacherInformation: React.FC<TeacherInformationProps> = ({
    bio,
    name,
    profilePicture,
    username,
}) => {
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    return (
        <div className='flex gap-2 md:gap-4'>
            <Image
                src={profilePicture}
                width={150}
                height={150}
                alt={name}
                className='aspect-square h-[150px] w-[150px] rounded-xl object-cover'
            />

            <div>
                <Typography
                    className='flex items-center gap-x-2'
                    variant={'h4'}
                >
                    <span>{name}</span>•
                    <span className='text-xs text-muted-foreground'>
                        @{username}
                    </span>
                </Typography>
                <Typography
                    className='text-pretty lg:max-w-2xl'
                    variant={'p'}
                    affects={'muted'}
                >
                    {prettyText(bio, isSmallScreen ? 120 : 500)}
                </Typography>

                <div className='mt-3 flex items-center gap-4'>
                    <SiGmail size={18} className='text-yellow-400' />
                    <SiInstagram size={18} className='text-pink-400' />
                    <SiWhatsapp size={18} className='text-green-400' />
                </div>
            </div>
        </div>
    );
};
export default TeacherInformation;
