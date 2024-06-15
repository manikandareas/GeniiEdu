'use client';
import { Search } from 'lucide-react';

import { useSession } from '../providers/SessionProvider';
import { Input } from '../ui/input';
import SidebarOnSM from './SidebarOnSM';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
    const { user } = useSession();
    return (
        <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <SidebarOnSM />
            <div className='hidden space-y-2.5 md:block'>
                <h1 className='text-xl'>Hey {user?.username},</h1>
                <p className='text-xs text-muted-foreground'>
                    It's sunny today and it's time to study 💪
                </p>
            </div>
            {/* <Breadcrumb className='hidden md:flex'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href='#'>Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href='#'>Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb> */}
            <div className='relative ml-auto flex-1 md:grow-0'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                    type='search'
                    placeholder='Search...'
                    className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
                />
            </div>
        </header>
    );
};
export default Header;
