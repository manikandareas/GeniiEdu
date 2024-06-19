import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/common/libs/utils';

const badgeVariants = cva(
    'inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                ongoing:
                    'border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow/30',
                completed:
                    'border-transparent bg-green-500/10 text-green-500 hover:bg-green/30',
                archive:
                    'border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow/30',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'ongoing',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
