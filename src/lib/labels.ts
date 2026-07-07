export const METRIC_LABELS = {
  estimate: 'Оценка популяции',
  confidence: 'Уверенность',
  risk: 'Уровень риска',
  activeEvents: 'Активных событий',
  range: 'Диапазон',
} as const;

export const CONTRIBUTION_LABELS = {
  direct: 'Прямой вклад',
  effective: 'Эффективный вклад',
  directHint:
    'Доля силы сигнала до объединения по зонам. Сумма по всем сигналам ≈ 100%.',
  effectiveHint:
    'Реальное влияние на итог с учётом слияния сигналов в одной локации. Сумма ≈ 100%.',
} as const;

export const PAGE_LABELS = {
  dashboard: 'Аналитика',
  signals: 'События',
  model: 'Параметры модели',
} as const;

export const CONFIDENCE_LEVEL_LABELS = {
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
} as const;
