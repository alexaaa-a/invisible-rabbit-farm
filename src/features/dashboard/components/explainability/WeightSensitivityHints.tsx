import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { applyWeightSensitivity } from '@/lib/applyWeightSensitivity';
import { useModelParams } from '@/hooks/useModelParams';
import type { WeightSensitivityHint } from '@/types/explainability';
import { DashboardCard } from '../DashboardCard';
import { formatDelta } from './explainabilityUtils';

interface WeightSensitivityHintsProps {
  hints: WeightSensitivityHint[];
}

export function WeightSensitivityHints({ hints }: WeightSensitivityHintsProps) {
  const navigate = useNavigate();
  const { modelParams, updateParam } = useModelParams();

  if (hints.length === 0) {
    return null;
  }

  const handleApply = (hint: WeightSensitivityHint) => {
    const nextParams = applyWeightSensitivity(modelParams, hint.apply);

    if (hint.apply.type === 'globalSensitivity') {
      updateParam('globalSensitivity', nextParams.globalSensitivity);
    } else {
      updateParam('eventWeights', nextParams.eventWeights);
    }

    navigate('/model');
  };

  return (
    <DashboardCard
      title="Что изменится при настройке весов"
      description="Прогноз при изменении параметров модели"
      action={
        <button
          type="button"
          onClick={() => navigate('/model')}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Открыть модель →
        </button>
      }
    >
      <ul className="space-y-2">
        {hints.map((hint) => (
          <li
            key={hint.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">{hint.parameter}</p>
              <p className="text-xs text-muted-foreground">{hint.scenario}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm tabular-nums">
                <span className="text-muted-foreground">{hint.estimateBefore}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">{hint.estimateAfter}</span>
                <span
                  className={cn(
                    'min-w-[2rem] text-right text-xs font-medium',
                    hint.delta > 0 && 'text-emerald-700',
                    hint.delta < 0 && 'text-orange-700',
                    hint.delta === 0 && 'text-muted-foreground',
                  )}
                >
                  {formatDelta(hint.delta)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleApply(hint)}
                className="shrink-0 rounded-md border border-border/80 px-2 py-1 text-xs font-medium transition-colors hover:bg-muted"
              >
                Применить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
