import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        default:
          'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs',
        secondary:
          'bg-zinc-100 dark:bg-blue-900/30 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-blue-800/40 border border-zinc-200/80 dark:border-blue-800/40',
        outline:
          'border border-zinc-200/80 dark:border-blue-900/50 bg-white/80 dark:bg-[#0c162e]/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-blue-900/40 shadow-2xs',
        ghost:
          'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white',
        link: 'text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto font-medium',
        nude: 'bg-gradient-to-r from-[#e8c9a8] via-[#d59c77] to-[#c17f59] text-white hover:opacity-95 shadow-sm',
        'nude-locked':
          'bg-gradient-to-r from-[#d8bfab] via-[#c9a68e] to-[#b38b71] text-white/90 shadow-sm opacity-90',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 shadow-xs',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base',
        icon: 'h-9 w-9 rounded-xl',
        'icon-sm': 'h-7 w-7 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
