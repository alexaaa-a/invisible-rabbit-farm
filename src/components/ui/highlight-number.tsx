import { motion, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface HighlightNumberProps {
  value: number | string;
  children?: ReactNode;
  className?: string;
}

export function HighlightNumber({ value, children, className }: HighlightNumberProps) {
  const prefersReducedMotion = useReducedMotion();
  const renderedValue = useRef(value);
  const shouldAnimate = renderedValue.current !== value;
  renderedValue.current = value;

  const content = children ?? value;

  if (prefersReducedMotion || !shouldAnimate) {
    return <span className={cn('inline-block', className)}>{content}</span>;
  }

  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0.6, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('inline-block', className)}
    >
      {content}
    </motion.span>
  );
}
