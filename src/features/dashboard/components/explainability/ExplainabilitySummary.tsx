import { formatRabbitCount } from '@/lib/format';
import type { ExplainabilityResult } from '@/types/explainability';

interface ExplainabilitySummaryProps {
  explainability: ExplainabilityResult;
  estimate: number;
}

export function ExplainabilitySummary({ explainability, estimate }: ExplainabilitySummaryProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 px-5 py-4">
      <p className="dashboard-label">Почему {formatRabbitCount(estimate)}</p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
        {explainability.summary}
      </p>
      {explainability.topDriverIds.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {explainability.topDriverIds.map((eventId) => {
            const signal = explainability.signals.find((item) => item.eventId === eventId);
            if (!signal) {
              return null;
            }
            return (
              <span
                key={eventId}
                className="rounded-md border border-border/80 bg-card px-2.5 py-1 text-xs text-muted-foreground"
              >
                <span className="font-mono text-[10px] text-foreground/70">{eventId}</span>
                {' · '}
                <span className="font-medium text-foreground">{signal.effectivePercent}%</span>
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
