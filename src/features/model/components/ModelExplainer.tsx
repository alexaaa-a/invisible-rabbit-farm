const EXPLAINER_POINTS = [
  'Каждый сигнал получает силу: тип × интенсивность × √количество.',
  'Сигналы в одной зоне частично объединяются, чтобы не считать одних кроликов дважды.',
  'Оценка популяции = сумма по зонам × чувствительность × калибровочный коэффициент.',
  'Уверенность зависит от разнообразия сигналов, их объёма и покрытия зон.',
] as const;

export function ModelExplainer() {
  return (
    <div className="surface-card p-5">
      <h3 className="text-sm font-semibold tracking-tight">Как считается оценка</h3>
      <ol className="mt-4 space-y-3">
        {EXPLAINER_POINTS.map((point, index) => (
          <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-semibold text-foreground">
              {index + 1}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
