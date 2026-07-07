import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface DashboardCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
  interactive?: boolean;
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  noPadding = false,
  interactive = false,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        'surface-card overflow-hidden',
        interactive && 'surface-card-interactive',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 border-b border-border/50 bg-muted/20 px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cn(!noPadding && 'p-5', contentClassName)}>{children}</div>
    </section>
  );
}

interface MetricCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  footer?: ReactNode;
  className?: string;
}

export function MetricCard({ label, value, hint, footer, className }: MetricCardProps) {
  return (
    <section
      className={cn(
        'surface-card flex flex-col justify-between px-5 py-4',
        className,
      )}
    >
      <div>
        <p className="dashboard-label">{label}</p>
        <div className="mt-3">{value}</div>
        {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {footer ? <div className="mt-4 border-t border-border/50 pt-3">{footer}</div> : null}
    </section>
  );
}
