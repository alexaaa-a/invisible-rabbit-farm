import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const MAX_WIDTH = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  full: 'max-w-none',
} as const;

interface PageScrollProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  maxWidth?: keyof typeof MAX_WIDTH;
}

export function PageScroll({
  children,
  className,
  innerClassName,
  maxWidth = 'lg',
}: PageScrollProps) {
  return (
    <div className={cn('h-full min-h-0 flex-1 overflow-y-auto overscroll-y-contain premium-scroll', className)}>
      <div
        className={cn(
          'mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8',
          MAX_WIDTH[maxWidth],
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
