import * as React from 'react';

import { cn } from '@/common/libs/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
    ({ className, type, ...props }, ref) => {
        const [passwordReveal, setPasswordReveal] = React.useState(false);
        return (
            <div className='relative'>
                <input
                    type={passwordReveal ? 'text' : 'password'}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                <div
                    className='group absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'
                    onClick={() => setPasswordReveal(!passwordReveal)}
                >
                    {passwordReveal ? (
                        <Eye
                            size={18}
                            className='transition-all group-hover:scale-105'
                        />
                    ) : (
                        <EyeOff
                            size={18}
                            className='transition-all group-hover:scale-105'
                        />
                    )}
                </div>
            </div>
        );
    },
);
Password.displayName = 'Password';

export { Password };
