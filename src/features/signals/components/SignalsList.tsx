import { useEffect, useRef } from 'react';
import { PlusIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useFarmContext } from '@/state/FarmContext';
import type { EventContribution, FarmEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { pluralize } from '@/lib/format';
import { EventEditorCard } from './EventEditorCard';

interface SignalsListProps {
  events: FarmEvent[];
  contributions: EventContribution[];
  highlightedEventId: string | null;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<FarmEvent>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SignalsList({
  events,
  contributions,
  highlightedEventId,
  onAdd,
  onUpdate,
  onToggle,
  onDelete,
}: SignalsListProps) {
  const { state } = useFarmContext();

  const contributionMap = new Map(
    contributions.map((item) => [item.eventId, item]),
  );

  const sortedEvents = [...events].sort((a, b) => {
    const aPercent = contributionMap.get(a.id)?.effectivePercent ?? 0;
    const bPercent = contributionMap.get(b.id)?.effectivePercent ?? 0;
    return bPercent - aPercent;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pluralize(events.length, 'событие', 'события', 'событий')} · отсортировано по вкладу
        </p>
        <Button size="sm" onClick={onAdd}>
          <PlusIcon className="h-4 w-4" />
          Добавить событие
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="Событий пока нет"
          description="Добавьте первое косвенное событие — следы, шорох или пропажу морковки — чтобы начать оценку популяции."
          icon="sparkles"
          action={
            <Button size="sm" onClick={onAdd}>
              <PlusIcon className="h-4 w-4" />
              Добавить событие
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {sortedEvents.map((event) => {
            const contribution = contributionMap.get(event.id);
            return (
              <SignalListItem
                key={event.id}
                event={event}
                isHighlighted={highlightedEventId === event.id}
                highlightedField={
                  highlightedEventId === event.id ? state.ui.highlightedField : null
                }
                contribution={contribution}
                onUpdate={(patch) => onUpdate(event.id, patch)}
                onToggle={() => onToggle(event.id)}
                onDelete={() => onDelete(event.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SignalListItemProps {
  event: FarmEvent;
  isHighlighted: boolean;
  highlightedField: 'intensity' | 'count' | null;
  contribution?: EventContribution;
  onUpdate: (patch: Partial<FarmEvent>) => void;
  onToggle: () => void;
  onDelete: () => void;
}

function SignalListItem({
  event,
  isHighlighted,
  highlightedField,
  contribution,
  onUpdate,
  onToggle,
  onDelete,
}: SignalListItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHighlighted]);

  return (
    <div ref={ref}>
      <EventEditorCard
        event={event}
        isHighlighted={isHighlighted}
        highlightedField={highlightedField}
        contributionPercent={contribution?.directPercent}
        effectivePercent={contribution?.effectivePercent}
        onUpdate={onUpdate}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </div>
  );
}
