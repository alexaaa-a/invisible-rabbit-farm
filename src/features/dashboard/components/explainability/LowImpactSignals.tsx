import type { SignalExplanation } from '@/types/explainability';
import { getEventLabel } from '@/domain';
import { DashboardCard } from '../DashboardCard';

interface LowImpactSignalsProps {
  signals: SignalExplanation[];
  lowImpactEventIds: string[];
}

export function LowImpactSignals({ signals, lowImpactEventIds }: LowImpactSignalsProps) {
  const lowImpactSignals = signals.filter((signal) =>
    lowImpactEventIds.includes(signal.eventId),
  );

  if (lowImpactSignals.length === 0) {
    return null;
  }

  return (
    <DashboardCard
      title="Минимальное влияние"
      description="События с эффективным вкладом ниже 3% — почти не меняют итог"
    >
      <ul className="space-y-3">
        {lowImpactSignals.map((signal) => (
          <li
            key={signal.eventId}
            className="flex items-center justify-between gap-4 rounded-md border border-dashed border-border/80 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{getEventLabel(signal.eventType)}</p>
              <p className="text-xs text-muted-foreground">{signal.location}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm tabular-nums text-muted-foreground">
                {signal.effectivePercent}%
              </p>
              <p className="text-[10px] text-muted-foreground">эффективный вклад</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
