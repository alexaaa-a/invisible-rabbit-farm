import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-shimmer rounded-md bg-muted/80', className)}
      {...props}
    />
  );
}

export { Skeleton };
