import { motion } from 'framer-motion';
import { formatRange } from '@/lib/format';
import { MetricCard } from './DashboardCard';

interface EstimatedRabbitsCardProps {
  estimate: number;
  range: [number, number];
}

export function EstimatedRabbitsCard({ estimate, range }: EstimatedRabbitsCardProps) {
  return (
    <MetricCard
      label="Оценка кроликов"
      value={
        <motion.p
          key={estimate}
          initial={{ opacity: 0.5, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="dashboard-value"
        >
          {estimate}
        </motion.p>
      }
      hint={`Диапазон ${formatRange(range)} · индекс популяции`}
    />
  );
}
