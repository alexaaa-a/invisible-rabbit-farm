import { ArrowRightIcon } from 'lucide-react';
import { PRIORITY_SEMANTIC } from '@/lib/semanticColors';
import { cn } from '@/lib/cn';
import type { Recommendation, RecommendationPriority } from '@/types';
import { DashboardCard } from './DashboardCard';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
  onSelectRecommendation?: (recommendation: Recommendation) => void;
}

const PRIORITY_LABELS: Record<RecommendationPriority, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export function RecommendationsCard({
  recommendations,
  onSelectRecommendation,
}: RecommendationsCardProps) {
  const visibleRecommendations = recommendations.slice(0, 5);

  return (
    <DashboardCard
      title="Рекомендации"
      description="Нажмите, чтобы перейти к нужному событию"
      className="h-full"
    >
      {visibleRecommendations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {recommendations.length === 0
            ? 'Рекомендаций пока нет'
            : 'Нет рекомендаций для выбранной зоны'}
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {visibleRecommendations.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectRecommendation?.(item)}
                className="group flex w-full items-start gap-3 py-3.5 text-left first:pt-0 last:pb-0"
              >
                <span
                  className={cn(
                    'mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-inset',
                    PRIORITY_SEMANTIC[item.priority],
                  )}
                >
                  {PRIORITY_LABELS[item.priority]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{item.action}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                </div>
                <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
