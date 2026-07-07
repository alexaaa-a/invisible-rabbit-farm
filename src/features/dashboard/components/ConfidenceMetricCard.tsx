import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { formatPercent } from '@/lib/format';
import type { ConfidenceLevel } from '@/types';
import { MetricCard } from './DashboardCard';

interface ConfidenceMetricCardProps {
  confidence: number;
  level: ConfidenceLevel;
}

const LEVEL_CONFIG: Record<
  ConfidenceLevel,
  { label: string; barColor: string; textColor: string }
> = {
  low: {
    label: 'Низкая уверенность',
    barColor: 'bg-red-500',
    textColor: 'text-red-600',
  },
  medium: {
    label: 'Средняя уверенность',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-600',
  },
  high: {
    label: 'Высокая уверенность',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
  },
};

export function ConfidenceMetricCard({ confidence, level }: ConfidenceMetricCardProps) {
  const config = LEVEL_CONFIG[level];

  return (
    <MetricCard
      label="Уверенность"
      value={
        <motion.p
          key={confidence}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="dashboard-value"
        >
          {formatPercent(confidence)}
        </motion.p>
      }
      hint={config.label}
      footer={
        <div className="space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              key={confidence}
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={cn('h-full rounded-full', config.barColor)}
            />
          </div>
          <p className={cn('text-xs font-medium', config.textColor)}>{config.label}</p>
        </div>
      }
    />
  );
}
