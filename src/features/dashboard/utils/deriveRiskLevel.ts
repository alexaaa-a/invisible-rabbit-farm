import { RECOMMENDATION_THRESHOLDS } from '@/domain/config';
import type { EstimationResult } from '@/types';

export type RiskLevel = 'unknown' | 'low' | 'moderate' | 'high' | 'critical';

export interface RiskAssessment {
  level: RiskLevel;
  label: string;
  description: string;
}

const RISK_LABELS: Record<RiskLevel, string> = {
  unknown: 'Нет данных',
  low: 'Низкий',
  moderate: 'Умеренный',
  high: 'Высокий',
  critical: 'Критический',
};

const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  unknown: 'Сигналы слишком слабы или отфильтрованы — оценка риска невозможна',
  low: 'Минимальная активность во всех зонах мониторинга',
  moderate: 'Повышенная активность — продолжайте наблюдение',
  high: 'Несколько сильных индикаторов — рекомендуются действия',
  critical: 'Высокий риск популяции — требуется немедленная реакция',
};

export function deriveRiskLevel(result: EstimationResult): RiskAssessment {
  if (result.estimate === 0) {
    return {
      level: 'unknown',
      label: RISK_LABELS.unknown,
      description: RISK_DESCRIPTIONS.unknown,
    };
  }

  const highPriorityCount = result.recommendations.filter(
    (item) => item.priority === 'high',
  ).length;
  const hotZones = result.zoneActivity.filter((zone) => zone.level === 'high').length;

  let level: RiskLevel = 'low';

  if (
    result.estimate >= RECOMMENDATION_THRESHOLDS.highPopulation + 1 ||
    (result.estimate >= RECOMMENDATION_THRESHOLDS.highPopulation && highPriorityCount >= 2)
  ) {
    level = 'critical';
  } else if (
    result.estimate >= RECOMMENDATION_THRESHOLDS.highPopulation ||
    highPriorityCount >= 1 ||
    hotZones >= 1
  ) {
    level = 'high';
  } else if (result.estimate >= 3 || result.confidenceLevel === 'low') {
    level = 'moderate';
  }

  return {
    level,
    label: RISK_LABELS[level],
    description: RISK_DESCRIPTIONS[level],
  };
}
