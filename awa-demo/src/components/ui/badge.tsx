import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-black dark:bg-white text-white dark:text-black shadow-2xs',
        secondary:
          'border border-zinc-200/80 dark:border-blue-900/40 bg-zinc-100 dark:bg-blue-950/40 text-zinc-800 dark:text-zinc-200',
        outline:
          'border border-zinc-300 dark:border-blue-800/60 text-zinc-700 dark:text-zinc-300',
        amber:
          'border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        blue:
          'border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
        emerald:
          'border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        rose:
          'border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
        purple:
          'border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
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
