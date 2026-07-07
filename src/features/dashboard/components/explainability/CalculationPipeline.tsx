import type { CalculationStep } from '@/types/explainability';

interface CalculationPipelineProps {
  steps: CalculationStep[];
}

export function CalculationPipeline({ steps }: CalculationPipelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-border"
              aria-hidden
            />
          ) : null}
          <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[10px] font-semibold tabular-nums text-muted-foreground">
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="text-xs font-semibold tabular-nums text-foreground">
                {step.result}
              </p>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{step.formula}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
