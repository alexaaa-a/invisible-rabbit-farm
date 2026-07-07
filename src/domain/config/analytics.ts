export const SCALE_SIGNAL_FLOOR_FACTOR = 0.6;

export const CORRELATION_SCORE = {
  base: 0.7,
  perExtraSignal: 0.15,
} as const;

export const INSIGHT_LIMIT = 3;

export const SCALE_BONUS_DIVISOR = 10;

export const RECOMMENDATION_LIMIT = 6;

export const WEIGHT_SENSITIVITY_DELTA = 0.2;
export const SENSITIVITY_PREVIEW_DELTA = 0.3;

export const IMPACT_THRESHOLDS = {
  high: 25,
  medium: 10,
  low: 3,
} as const;

export const LOW_IMPACT_THRESHOLD = 3;

export const MIN_ESTIMATE_WITH_SIGNALS = 1;
