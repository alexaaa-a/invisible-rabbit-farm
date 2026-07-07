import { useNavigate } from 'react-router-dom';
import { getEventLabel } from '@/domain';
import { cn } from '@/lib/cn';
import type { FarmEvent, RankedSignal } from '@/types';
import { DashboardCard } from './DashboardCard';

interface TopSignalsCardProps {
  rankedSignals: RankedSignal[];
  events: FarmEvent[];
  highlightedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
}

export function TopSignalsCard({
  rankedSignals,
  events,
  highlightedEventId,
  onSelectEvent,
}: TopSignalsCardProps) {
  const navigate = useNavigate();
  const eventIds = new Set(events.map((event) => event.id));
  const topSignals = rankedSignals.filter((signal) => eventIds.has(signal.eventId)).slice(0, 5);
  const maxPercent = topSignals[0]?.effectivePercent ?? 1;

  return (
    <DashboardCard
      title="Топ событий"
      description="По эффективному вкладу в оценку"
      className="h-full"
    >
      {topSignals.length === 0 ? (
        <p className="text-sm text-muted-foreground">Нет данных для выбранной зоны</p>
      ) : (
        <ul className="space-y-4">
          {topSignals.map((signal) => {
            const event = events.find((item) => item.id === signal.eventId);
            if (!event) {
              return null;
            }

            const barWidth = (signal.effectivePercent / maxPercent) * 100;

            return (
              <li key={signal.eventId}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectEvent(signal.eventId);
                    navigate('/signals');
                  }}
                  className={cn(
                    'group w-full rounded-lg px-2 py-2 text-left transition-all duration-200',
                    highlightedEventId === signal.eventId
                      ? 'bg-accent shadow-sm'
                      : 'hover:bg-muted/50 hover:shadow-sm',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {getEventLabel(event.event)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.location} · {event.time}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">
                        {signal.effectivePercent}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">№{signal.rank}</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/75 transition-all duration-500 ease-out group-hover:bg-foreground"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}
