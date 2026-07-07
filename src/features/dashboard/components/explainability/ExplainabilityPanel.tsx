import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { ExplainabilityResult } from '@/types/explainability';
import { DashboardCard } from '../DashboardCard';
import { CalculationPipeline } from './CalculationPipeline';
import { LowImpactSignals } from './LowImpactSignals';
import { SignalContributionTable } from './SignalContributionTable';
import { WeightSensitivityHints } from './WeightSensitivityHints';

interface ExplainabilityPanelProps {
  explainability: ExplainabilityResult;
}

export function ExplainabilityPanel({ explainability }: ExplainabilityPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (explainability.signals.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="dashboard-label">Объяснимость</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Детали расчёта
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Вклад событий, зон и чувствительность модели
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          {detailsOpen ? 'Свернуть' : 'Развернуть'}
          <ChevronDownIcon
            className={cn('h-4 w-4 transition-transform', detailsOpen && 'rotate-180')}
          />
        </button>
      </header>

      {detailsOpen ? (
        <>
          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <DashboardCard
                title="Пайплайн расчёта"
                description="Пошаговая декомпозиция модели"
                className="h-full"
              >
                <CalculationPipeline steps={explainability.steps} />
              </DashboardCard>
            </div>

            <div className="space-y-4 lg:col-span-3">
              {explainability.zones.length > 0 ? (
                <DashboardCard
                  title="Вклад зон"
                  description="Распределение активности по локациям"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    {explainability.zones.map((zone) => (
                      <div
                        key={zone.location}
                        className="rounded-md border border-border/60 px-3 py-2.5"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-medium">{zone.location}</p>
                          <p className="text-sm font-semibold tabular-nums">
                            {zone.sharePercent}%
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          балл {zone.zoneScore} · {zone.eventCount} событ.
                        </p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground/70"
                            style={{ width: `${zone.sharePercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              ) : null}

              <WeightSensitivityHints hints={explainability.weightHints} />
            </div>
          </div>

          <SignalContributionTable signals={explainability.signals} />

          <LowImpactSignals
            signals={explainability.signals}
            lowImpactEventIds={explainability.lowImpactEventIds}
          />
        </>
      ) : (
        <SignalContributionTable signals={explainability.signals.slice(0, 3)} compact />
      )}
    </section>
  );
}
