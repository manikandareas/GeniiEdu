import Link from 'next/link';
import { SiDuolingo } from 'react-icons/si';

type AppLogoProps = {};

const AppLogo: React.FC<AppLogoProps> = () => {
    return (
        <Link
            href='/'
            className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
        >
            <SiDuolingo className='h-5 w-5 transition-all group-hover:scale-110' />
            <span className='sr-only'>Genii Edu</span>
        </Link>
    );
};
export default AppLogo;
