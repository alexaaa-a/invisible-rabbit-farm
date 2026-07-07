import { motion } from 'framer-motion';
import { RabbitIcon, SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: 'rabbit' | 'sparkles';
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon = 'rabbit',
  className,
}: EmptyStateProps) {
  const Icon = icon === 'sparkles' ? SparklesIcon : RabbitIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'surface-card relative overflow-hidden border-dashed px-6 py-14 text-center',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 50% 0%, oklch(0.94 0.02 264 / 0.5), transparent 55%)',
        }}
      />

      <div className="relative mx-auto flex max-w-sm flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-muted/50 shadow-sm"
        >
          <Icon className="h-7 w-7 text-muted-foreground/70" strokeWidth={1.5} />
        </motion.div>

        <div>
          <p className="text-base font-semibold tracking-tight">{title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-balance">
            {description}
          </p>
        </div>

        {action ? <div className="mt-1">{action}</div> : null}
      </div>
    </motion.div>
  );
}
