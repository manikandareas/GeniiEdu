import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/app/_components/ui/card';
import Image from 'next/image';
import { SiGmail, SiInstagram, SiWhatsapp } from 'react-icons/si';

type TeacherCardProps = {
    profilePicture: string;
    name: string;
    username: string;
};

const TeacherCard: React.FC<TeacherCardProps> = ({
    name,
    profilePicture,
    username,
}) => {
    return (
        <Card className=''>
            <CardHeader>
                <CardTitle>Teacher</CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent className='flex items-center gap-2'>
                <Image
                    src={profilePicture}
                    width={50}
                    height={50}
                    alt={name}
                    className='rounded-full'
                />
                <div className='space-y-1'>
                    <p>{name}</p>
                    <p className='text-xs text-muted-foreground'>@{username}</p>
                </div>
            </CardContent>
            <CardFooter className='flex items-center gap-4'>
                <SiGmail size={18} className='text-yellow-400' />
                <SiInstagram size={18} className='text-pink-400' />
                <SiWhatsapp size={18} className='text-green-400' />
            </CardFooter>
        </Card>
    );
};
export default TeacherCard;
