import { cn } from '@/lib/cn';
import type { SignalImpactLevel } from '@/types/explainability';

const IMPACT_LABELS: Record<SignalImpactLevel, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
  minimal: 'Минимальный',
};

const IMPACT_STYLES: Record<SignalImpactLevel, string> = {
  high: 'bg-foreground text-background',
  medium: 'bg-foreground/80 text-background',
  low: 'bg-muted text-muted-foreground',
  minimal: 'bg-muted/60 text-muted-foreground',
};

export function ImpactBadge({ level }: { level: SignalImpactLevel }) {
  return (
    <span
      className={cn(
        'inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        IMPACT_STYLES[level],
      )}
    >
      {IMPACT_LABELS[level]}
    </span>
  );
}
