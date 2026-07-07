import type { ActivityLevel } from '@/types';
import type { RiskLevel } from '@/features/dashboard/utils/deriveRiskLevel';

export const RISK_SEMANTIC = {
  unknown: 'text-muted-foreground',
  low: 'text-emerald-700',
  moderate: 'text-amber-700',
  high: 'text-orange-700',
  critical: 'text-red-700',
} as const satisfies Record<RiskLevel, string>;

export const ACTIVITY_SEMANTIC = {
  low: 'bg-muted text-muted-foreground ring-border',
  medium: 'bg-amber-50 text-amber-800 ring-amber-600/15',
  high: 'bg-orange-50 text-orange-800 ring-orange-600/15',
} as const satisfies Record<ActivityLevel, string>;

export const PRIORITY_SEMANTIC = {
  high: 'bg-red-50 text-red-800 ring-red-600/15',
  medium: 'bg-amber-50 text-amber-800 ring-amber-600/15',
  low: 'bg-muted text-muted-foreground ring-border',
} as const;
