import { HighlightNumber } from '@/components/ui/highlight-number';
import { useFarmAnalysis } from '@/hooks/useFarmAnalysis';
import { useEvents } from '@/hooks/useEvents';
import { formatPercent, formatRange } from '@/lib/format';
import { CONFIDENCE_LEVEL_LABELS, METRIC_LABELS } from '@/lib/labels';
import { RISK_SEMANTIC } from '@/lib/semanticColors';
import { deriveRiskLevel } from '@/features/dashboard/utils/deriveRiskLevel';
import { cn } from '@/lib/cn';

export function AnalyticsSummaryBar() {
  const analysis = useFarmAnalysis();
  const { events } = useEvents();
  const activeCount = events.filter((event) => event.enabled).length;
  const risk = deriveRiskLevel(analysis);
  const hasEstimate = activeCount > 0 && analysis.estimate > 0;

  const items = [
    {
      label: METRIC_LABELS.estimate,
      value: activeCount === 0 ? '—' : String(analysis.estimate),
      hint:
        activeCount === 0
          ? 'нет событий'
          : analysis.estimate === 0
            ? 'сигналы отфильтрованы'
            : formatRange(analysis.range),
    },
    {
      label: METRIC_LABELS.confidence,
      value: activeCount === 0 ? '—' : formatPercent(analysis.confidence),
      hint:
        activeCount === 0
          ? 'ожидание'
          : analysis.estimate === 0
            ? 'недостаточно сигналов'
            : CONFIDENCE_LEVEL_LABELS[analysis.confidenceLevel],
    },
    {
      label: METRIC_LABELS.risk,
      value: activeCount === 0 ? '—' : risk.label,
      hint: activeCount === 0 ? 'ожидание' : risk.description,
      riskLevel: activeCount === 0 ? undefined : risk.level,
    },
    {
      label: METRIC_LABELS.activeEvents,
      value: String(activeCount),
      hint: `из ${events.length}`,
    },
  ];

  return (
    <div className="glass-bar px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Сводка
        </p>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8">
          {items.map((item) => (
            <div key={item.label} className="flex shrink-0 items-baseline gap-2">
              <span className="text-[11px] text-muted-foreground">{item.label}</span>
              <HighlightNumber
                value={item.value}
                className={cn(
                  'text-sm font-semibold tabular-nums tracking-tight',
                  item.riskLevel && RISK_SEMANTIC[item.riskLevel],
                  !hasEstimate && item.label === METRIC_LABELS.estimate && activeCount > 0
                    ? 'text-muted-foreground'
                    : null,
                )}
              />
              <span className="hidden max-w-[14rem] truncate text-[11px] text-muted-foreground sm:inline">
                {item.hint}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
