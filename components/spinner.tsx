import * as React from 'react';

import { cn } from '@/lib/utils';

import { VariantProps, cva } from 'class-variance-authority';
import { Loader } from 'lucide-react';

const spinnerVariants = cva(
    'animate-spin flex flex-col',
    {
        variants: {
            size: {
                small: "w-4 h-4",
                default: "w-6 h-6",
                large: "w-8 h-8",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
)

const containerVariants = cva(
    'h-screen flex flex-col',
    {
        variants: {
            horizontal: {
                center: "items-center",
                left: "items-start",
                right: "items-end",
            },
            vertical: {
                center: "justify-center",
                top: "justify-start",
                bottom: "justify-end",
            },
        },
        defaultVariants: {
            horizontal: "center",
            vertical: "center",
        },
    }
)

export interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants>,
    VariantProps<typeof containerVariants> { }

function Spinner({ className, ...props }: SpinnerProps) {
    return (
        <div className={cn(containerVariants(props), className)} {...props}>
            <Loader className={cn(spinnerVariants(props))} />
        </div>
    )
}

export { Spinner };
