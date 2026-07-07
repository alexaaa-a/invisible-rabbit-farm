import { Link } from 'react-router-dom';
import { HighlightNumber } from '@/components/ui/highlight-number';
import { formatPercent, formatRange, formatRabbitCount } from '@/lib/format';
import { METRIC_LABELS } from '@/lib/labels';
import { RISK_SEMANTIC } from '@/lib/semanticColors';
import { cn } from '@/lib/cn';
import type { EstimationResult } from '@/types';
import type { RiskAssessment } from '@/features/dashboard/utils/deriveRiskLevel';

interface DashboardHeroProps {
  analysis: EstimationResult;
  risk: RiskAssessment;
}

export function DashboardHero({ analysis, risk }: DashboardHeroProps) {
  const { explainability, estimate, range, confidence } = analysis;
  const hasEstimate = estimate > 0;

  const heroTitle = hasEstimate
    ? `Почему ${formatRabbitCount(estimate)}`
    : 'Оценка недоступна';

  const heroSummary =
    explainability.summary ||
    'Активные сигналы слишком слабы или отфильтрованы порогом шума. Ослабьте фильтр на странице «Модель» или добавьте более сильные события.';

  return (
    <section className="surface-card relative mb-4 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            'linear-gradient(135deg, oklch(0.97 0.01 264 / 0.4) 0%, transparent 50%, oklch(0.98 0.008 184 / 0.25) 100%)',
        }}
      />

      <div className="relative border-b border-border/50 px-5 py-5 sm:px-6">
        <p className="dashboard-label">{heroTitle}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/85 text-balance">
          {heroSummary}
        </p>
      </div>

      <div className="relative flex flex-wrap items-center gap-5 px-5 py-5 sm:gap-8 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {METRIC_LABELS.estimate}
          </p>
          <HighlightNumber
            value={estimate}
            className="dashboard-value mt-1 block"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {METRIC_LABELS.range} {formatRange(range)}
          </p>
        </div>

        <div className="hidden h-12 w-px bg-border/70 sm:block" aria-hidden />

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {METRIC_LABELS.confidence}
          </p>
          <HighlightNumber
            value={formatPercent(confidence)}
            className="mt-1 block text-xl font-semibold tabular-nums sm:text-2xl"
          />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {METRIC_LABELS.risk}
          </p>
          <p className={cn('mt-1 text-xl font-semibold sm:text-2xl', RISK_SEMANTIC[risk.level])}>
            {risk.label}
          </p>
          <p className="mt-1 max-w-[12rem] text-xs leading-relaxed text-muted-foreground">
            {risk.description}
          </p>
        </div>

        {explainability.topDriverIds.length > 0 ? (
          <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
            {explainability.topDriverIds.map((eventId) => {
              const signal = explainability.signals.find((item) => item.eventId === eventId);
              if (!signal) {
                return null;
              }
              return (
                <Link
                  key={eventId}
                  to="/signals"
                  state={{ highlightEventId: eventId }}
                  className="metric-pill"
                >
                  <span className="font-medium">{signal.location}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="tabular-nums">{signal.effectivePercent}%</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
