'use client';

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
} from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from '../providers/session-provider';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import SignOutDialog from './sign-out-dialog';

type DropdownProfileProps = {};

const DropdownProfile: React.FC<DropdownProfileProps> = () => {
    const { user } = useSession();
    const router = useRouter();

    const onNavigateClick = (e: any) => {
        const to = e.currentTarget.getAttribute('data-href') as string;
        router.push(to);
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='icon'
                    className='overflow-hidden rounded-full'
                >
                    <Image
                        priority
                        src={user?.profilePicture ?? ''}
                        width={36}
                        height={36}
                        alt='Avatar'
                        className='overflow-hidden rounded-full'
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className='mr-2 h-4 w-4' />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className='mr-2 h-4 w-4' />
                        <span>Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        data-href={'/settings'}
                        onClick={onNavigateClick}
                    >
                        <Settings className='mr-2 h-4 w-4' />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Keyboard className='mr-2 h-4 w-4' />
                        <span>Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users className='mr-2 h-4 w-4' />
                        <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className='mr-2 h-4 w-4' />
                            <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Mail className='mr-2 h-4 w-4' />
                                    <span>Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <MessageSquare className='mr-2 h-4 w-4' />
                                    <span>Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className='mr-2 h-4 w-4' />
                                    <span>More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Plus className='mr-2 h-4 w-4' />
                        <span>New Team</span>
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Github className='mr-2 h-4 w-4' />
                    <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LifeBuoy className='mr-2 h-4 w-4' />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Cloud className='mr-2 h-4 w-4' />
                    <span>API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <SignOutDialog name={user?.name} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default DropdownProfile;
