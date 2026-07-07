import { ACTIVITY_SEMANTIC } from '@/lib/semanticColors';
import { cn } from '@/lib/cn';
import type { ActivityLevel, EstimationResult, FarmEvent } from '@/types';
import { DashboardCard } from './DashboardCard';

interface OverviewCardProps {
  analysis: EstimationResult;
  activeEventCount: number;
  selectedZone: FarmEvent['location'] | null;
  onSelectZone: (zone: FarmEvent['location'] | null) => void;
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  low: 'низкая',
  medium: 'средняя',
  high: 'высокая',
};

export function OverviewCard({
  analysis,
  activeEventCount,
  selectedZone,
  onSelectZone,
}: OverviewCardProps) {
  return (
    <DashboardCard
      title="Обзор"
      description="Нажмите на зону, чтобы отфильтровать дашборд"
      className="h-full"
    >
      <div className="grid gap-5">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatItem label="Активные события" value={String(activeEventCount)} />
          <StatItem label="Зоны" value={String(analysis.zoneActivity.length)} />
          <StatItem
            label="Индекс популяции"
            value={analysis.populationIndex.toFixed(2)}
            hint="Сумма активности × чувствительность"
          />
        </dl>

        <div>
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">
            Активность по зонам
          </p>
          <div className="grid grid-cols-2 gap-2">
            {analysis.zoneActivity.map((zone) => (
              <button
                key={zone.location}
                type="button"
                onClick={() =>
                  onSelectZone(selectedZone === zone.location ? null : zone.location)
                }
                className={cn(
                  'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all duration-200',
                  selectedZone === zone.location
                    ? 'border-foreground/25 bg-foreground text-background shadow-sm'
                    : 'border-border/60 bg-background/50 hover:border-border hover:bg-muted/50 hover:shadow-sm',
                )}
              >
                <span className="text-sm font-medium">{zone.location}</span>
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset transition-colors',
                    selectedZone === zone.location
                      ? 'bg-background/20 text-background ring-background/30'
                      : ACTIVITY_SEMANTIC[zone.level],
                  )}
                >
                  {ACTIVITY_LABELS[zone.level]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

function StatItem({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2.5">
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums tracking-tight">{value}</dd>
      {hint ? <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
