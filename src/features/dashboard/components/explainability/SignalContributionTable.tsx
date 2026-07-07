import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { getEventLabel } from '@/domain';
import type { SignalExplanation } from '@/types/explainability';
import { cn } from '@/lib/cn';
import { DashboardCard } from '../DashboardCard';
import { ImpactBadge } from './ImpactBadge';
import { formatFactor } from './explainabilityUtils';

interface SignalContributionTableProps {
  signals: SignalExplanation[];
  compact?: boolean;
}

export function SignalContributionTable({
  signals,
  compact = false,
}: SignalContributionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <DashboardCard
      title={compact ? 'Главные драйверы' : 'Вклад событий'}
      description={
        compact
          ? 'Топ-3 по эффективному влиянию'
          : 'Разложение по силе улики и влиянию на оценку'
      }
      noPadding
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20 text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Событие</th>
              <th className="px-3 py-3 font-medium">Сила улики</th>
              <th className="px-3 py-3 font-medium">Прямой %</th>
              <th className="px-3 py-3 font-medium">Эффективный %</th>
              {!compact ? <th className="px-3 py-3 font-medium">Влияние</th> : null}
              {!compact ? <th className="px-5 py-3 font-medium" /> : null}
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => {
              const isExpanded = expandedId === signal.eventId;
              return (
                <tr
                  key={signal.eventId}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium">{getEventLabel(signal.eventType)}</p>
                    <p className="text-xs text-muted-foreground">
                      {signal.location} · {signal.time}
                    </p>
                    {signal.mergeNote ? (
                      <p className="mt-1 text-[11px] text-amber-800">{signal.mergeNote}</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 tabular-nums">{signal.rawScore.toFixed(2)}</td>
                  <td className="px-3 py-3 tabular-nums">{signal.directPercent}%</td>
                  <td className="px-3 py-3">
                    <span className="font-semibold tabular-nums">
                      {signal.effectivePercent}%
                    </span>
                  </td>
                  {!compact ? (
                    <td className="px-3 py-3">
                      <ImpactBadge level={signal.impactLevel} />
                    </td>
                  ) : null}
                  {!compact ? (
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : signal.eventId)
                        }
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Факторы
                        <ChevronDownIcon
                          className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            isExpanded && 'rotate-180',
                          )}
                        />
                      </button>
                      {isExpanded ? (
                        <div className="mt-2 space-y-0.5 font-mono text-[10px] leading-relaxed text-muted-foreground">
                          <p>тип {formatFactor(signal.factors.baseWeight)}</p>
                          <p>× вес {formatFactor(signal.factors.eventWeightMultiplier)}</p>
                          <p>× инт. {formatFactor(signal.factors.intensityFactor)}</p>
                          <p>× √n {formatFactor(signal.factors.countFactor)}</p>
                          {signal.factors.classBonus > 1 ? (
                            <p>× бонус {formatFactor(signal.factors.classBonus)}</p>
                          ) : null}
                          {signal.zoneMergeWeight < 1 ? (
                            <p>× зона {formatFactor(signal.zoneMergeWeight)}</p>
                          ) : null}
                        </div>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
