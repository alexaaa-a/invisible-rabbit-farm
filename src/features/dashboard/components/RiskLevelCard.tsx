import { ShieldAlertIcon, ShieldCheckIcon, ShieldIcon, ShieldXIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { RiskAssessment, RiskLevel } from '../utils/deriveRiskLevel';
import { MetricCard } from './DashboardCard';

interface RiskLevelCardProps {
  risk: RiskAssessment;
}

const RISK_STYLES: Record<
  RiskLevel,
  { icon: typeof ShieldIcon; badge: string; dot: string }
> = {
  unknown: {
    icon: ShieldIcon,
    badge: 'bg-muted text-muted-foreground ring-border',
    dot: 'bg-muted-foreground/50',
  },
  low: {
    icon: ShieldCheckIcon,
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    dot: 'bg-emerald-500',
  },
  moderate: {
    icon: ShieldIcon,
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    dot: 'bg-amber-500',
  },
  high: {
    icon: ShieldAlertIcon,
    badge: 'bg-orange-50 text-orange-700 ring-orange-600/10',
    dot: 'bg-orange-500',
  },
  critical: {
    icon: ShieldXIcon,
    badge: 'bg-red-50 text-red-700 ring-red-600/10',
    dot: 'bg-red-500',
  },
};

export function RiskLevelCard({ risk }: RiskLevelCardProps) {
  const style = RISK_STYLES[risk.level];
  const Icon = style.icon;

  return (
    <MetricCard
      label="Уровень риска"
      value={
        <div className="flex items-center gap-3">
          <motion.span
            key={risk.level}
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ring-1 ring-inset',
              style.badge,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
            {risk.label}
          </motion.span>
        </div>
      }
      hint={risk.description}
      footer={
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          <span>На основе популяции, зон и сигналов</span>
        </div>
      }
    />
  );
}
